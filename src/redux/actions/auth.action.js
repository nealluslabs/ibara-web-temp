import { db, fb, auth, storage } from '../../config/firebase';
import { clearUser, loginFailed, loginSuccess, logoutFxn, signupFailed, storeUserData } from '../reducers/auth.slice';
import { v4 as uuidv4 } from 'uuid';
import { notifyErrorFxn, notifySuccessFxn } from 'src/utils/toast-fxn';
import { clearGroup } from '../reducers/group.slice';
import { fetchAllTreatmentCategories, fetchAllTreatmentTests, getAdmittedPatients, getAllPatients, getWaitingRoomPatients } from './patient.action';
import { fetchAllCategories,fetchAllGroupTreatmentCategories } from './group.action';



export const signCandidateIn = (user, navigate, setLoading) => async (dispatch) => {
  fb.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    console.log('Signed In user is: ', user.email);
     dispatch(fetchCandidateData(user.uid/*"ADq0LNbilFVUdDl8WrLIbOeP8xl2"*/, "sigin", navigate, setLoading));
    
       dispatch(getAllPatients());
      
       
        dispatch(fetchAllTreatmentCategories());
        dispatch(fetchAllTreatmentTests());
  })
  .catch((error) => {
    setLoading(false);
    var errorCode = error.code;
    var errorMessage = error.message;
   // alert(errorMessage);
     notifyErrorFxn(error.message);
    console.log('Error Code is: ', errorCode, + ' Msg is: ', errorMessage);
    dispatch(loginFailed(errorMessage));
  });

};


export const signExaminerIn = (user, navigate, setLoading) => async (dispatch) => {
  fb.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    console.log('Signed In user is: ', user.email);
     dispatch(fetchExaminerData(user.uid/*"iu2Nxs2jksaxYl1FAEsR4Rl7MwD3"*/, "sigin", navigate, setLoading));
     dispatch(fetchAllCategories())
    dispatch(fetchAllGroupTreatmentCategories())
    
  })
  .catch((error) => {
    setLoading(false);
    var errorCode = error.code;
    var errorMessage = error.message;
   // alert(errorMessage);
    notifyErrorFxn(error.message);
    console.log('Error Code is: ', errorCode, + ' Msg is: ', errorMessage);
    dispatch(loginFailed(errorMessage));
  });

};


export const signup = (user, navigate, setLoading) => async (dispatch) => {
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  var today  = new Date();
  
    fb.auth().createUserWithEmailAndPassword(
      user.email,
      user.passwordb
  ).then((res)=>{

   /* fb.auth().sendEmailVerification(user.email) YOU STOPPED HERE - 21 OCT 2023, WHAT DO I NEED TO PASS INTO  THIS ? */
    
    //fb.auth().sendPasswordResetEmail(email)

    return db.collection('Candidates').doc(res.user.uid).set({
      uid: res.user.uid,
      email: user.email,
      firstName: user.fname,
      lastName: user.lname,
     /* age: '25',
      gender: 'Male',
      complaint: 'Malu',
      isAdmitted: false,*/
      password: user.password,
      accountCreated: today.toLocaleDateString("en-US", options),
    })
  }).then(() => {
    notifySuccessFxn('Registered Successfully✔');
    navigate('/login', { replace: true });
  }).catch((err) => {
    console.error("Error signing up: ", err);
    var errorMessage = err.message;
    notifyErrorFxn(errorMessage);
    dispatch(signupFailed({ errorMessage }));
    setLoading(false);
  })
  }



  export const signCandidateUp = (user, navigate, setLoading) => async (dispatch) => {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date();
    
      fb.auth().createUserWithEmailAndPassword(
        user.email,
        user.password
    ).then(async(res)=>{
   
         fb.auth().sendPasswordResetEmail(user.email)

    return res
    }

    )
    .then((res)=>{
      return db.collection('Candidates').doc(res.user.uid).set({
        uid: res.user.uid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
       /* age: '25',
        gender: 'Male',
        complaint: 'Malu',
        isAdmitted: false,*/
        password: user.password,
        registeredOn: today.toLocaleDateString("en-US", options),


      })
    }).then(() => {
      notifySuccessFxn(`Registered Candidate ${user.firstName + " " + user.lastName} ✔`);
      navigate('/dashboard/examiner', { replace: true });
    }).catch((err) => {
      console.error("Error signing candidate up: ", err);
      var errorMessage = err.message;
      notifyErrorFxn(errorMessage);
      dispatch(signupFailed({ errorMessage }));
      setLoading(false);
    })
    }





export const uploadImage = (user, file, navigate, setLoading) => async (dispatch) => {
  const imageName = uuidv4() + '.' + file?.name?.split('.')?.pop();
  console.log('File Name: ', imageName);
  const uploadTask = storage.ref(`profile_images/${imageName}`).put(file);
  uploadTask.on(
    "state_changed",
    snapshot => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      // setProgress(progress);
    },
    error => {
      console.log(error);
    },
    () => {
      storage
        .ref("profile_images")
        .child(imageName)
        .getDownloadURL()
        .then(url => {
          console.log('Image URL: ', url);
          dispatch(signup(user, file, navigate, setLoading, url));
        });
    }
  );
}


export const fetchCandidateData = (id, type, navigate, setLoading) => async (dispatch) => {
  var user = db.collection("Candidates").doc(id);
  user.get().then((doc) => {
  if (doc.exists) {
    // console.log("User Data:", doc.data());
    dispatch(storeUserData(doc.data()));
    if(type === "sigin"){
      // notifySuccessFxn("Logged In😊");
      navigate('/entry', { replace: true });
    }
  } else {
      setLoading(false);
      notifyErrorFxn("Unauthorized❌")
      console.log("No such document!");
  }
}).catch((error) => {
  console.log("Error getting document:", error);
});
return user;
};


export const fetchExaminerData = (id, type, navigate, setLoading) => async (dispatch) => {
  var user = db.collection("Admins").doc(id);
  user.get().then((doc) => {
  if (doc.exists) {
    // console.log("User Data:", doc.data());
    dispatch(storeUserData(doc.data()));
    navigate('/dashboard/examiner', { replace: true });
    
    if(type === "sigin"){
       notifySuccessFxn("Logged In");
      navigate('/dashboard/examiner', { replace: true });
    }
  } else {
      setLoading(false);
      notifyErrorFxn("Unauthorized❌")
      console.log("No such document!");
  }
}).catch((error) => {
  console.log("Error getting document:", error);
});
return user;
};

export const uploadProfileImage = (profileData, file, userID, navigate, setLoading) => async (dispatch) => {
  const imageName = uuidv4() + '.' + file?.name?.split('.')?.pop();
  console.log('File Name: ', imageName);
  const uploadTask = storage.ref(`profile_images/${imageName}`).put(file);
  uploadTask.on(
    "state_changed",
    snapshot => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      // setProgress(progress);
    },
    error => {
      console.log(error);
    },
    () => {
      storage
        .ref("profile_images")
        .child(imageName)
        .getDownloadURL()
        .then(url => {
          console.log('Image URL: ', url);
          dispatch(updateProfile(profileData, userID, file, navigate, setLoading, url));
        });
    }
  );
}


export const updateProfile = (profileData, userID, file, navigate, setLoading, url) => async (dispatch) => {
  // return  
  db.collection('Admins').doc(userID).update({
    successMark: profileData.successMark,
    profileImage: url,
    password:profileData.newPassword
  }).then((res)=>{
       if(profileData?.newPassword){
        //update password start
        const user = auth.currentUser;
        user.updatePassword(profileData.newPassword)
          .then(() => {
            setLoading(false);
            console.log("Password updated successfully");
            notifySuccessFxn("Updated successfully");
            dispatch(fetchExaminerData(userID, "update", navigate, setLoading));
          })
          .catch((error) => {
            setLoading(false);
            console.error("Error updating password: ", error);
            notifyErrorFxn(error.message);
          });
       //update password end
       }else{
        setLoading(false);
        console.error("No Password to update");
        notifySuccessFxn("Updated successfully");
        dispatch(fetchExaminerData(userID, "update", navigate, setLoading));
       }
     
  }).catch((err) => {
    setLoading(false);
    console.log("ERR-: ", err);
  })
}


export const logout = (navigate) => async (dispatch) => {
  fb.auth().signOut().then(() => {
    dispatch(logoutFxn());
    dispatch(clearUser());
    dispatch(clearGroup());
    navigate('/home', { replace: true });
    console.log('logout successful!');
  }).catch((error) => {
    // An error happened.
    console.log('logout failed response: ', error.message);
  });
  
}