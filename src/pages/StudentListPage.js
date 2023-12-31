import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Container from '@mui/material/Container';
//import Layout from "../components/layout";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, Box, Typography, Paper, Button, Stack } from '@mui/material';
import { useNavigate,Link } from 'react-router-dom';
import CJobList from "../components/home/c-job-list";
import { getJobs } from "../redux/actions/job.action";
import {Skeleton} from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import { fetchJobs } from "src/redux/reducers/job.slice";


const theme = createTheme();



export default function StudentListPage() {
  const dispatch = useDispatch();
  const { jobs,isLoading } = useSelector((state) => state.jobs);
 
  const [jobArr, setJobArr] = useState(jobs);
  const navigate = useNavigate()

  //const { userDetails, error,message, isLoading } = useSelector((state) => state.loggedIn);
    
   /* useEffect(() => {
      console.log(userDetails)
     if(userDetails === '' ){
       
        navigate('/login')
        
      }
       
       
    }, [])*/

    const [state, setState] = useState({
      series: [{
        data: [700, 240, 748, 470, 590, 680, 800]
      }],
      options: {
        chart: {
          type: 'bar',
          height: 250,
          toolbar: {
            show: false
          },
          background: 'transparent',
          // background: '#fff',
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
            dataLabels: {
              position: 'top',
              style: {
                colors: ['#ffffff'],
              },
            },
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        },
        colors: ['#000000', '#F97D0B', '#F97D0B', '#F97D0B', '#F97D0B', '#F97D0B', '#F97D0B']
      }
    });
 
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {

      if(user && !user.isExaminer){
  
      navigate('/patient')
      }},[])
 
 useEffect(() => {
   dispatch(getJobs());  
   setTimeout(setJobArr(jobs), 1000);
  }, [])


  useEffect(() => {
    if(jobArr.length === 0 ){
      setJobArr(jobs);
       }  
     }, [jobs])

  console.log('cmc user data is: ', jobArr);

  return (
      
        
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
       {/*<h1 style={{position:"relative",fontWeight:"bold",left:"0px",marginBottom:"40px",fontSize:"30px"}}>STUDENT DASHBOARD</h1>*/}
      

       {isLoading ?
           
           <center>
           <Box sx={{ width: 300 }}>
           <Skeleton />
           <Skeleton animation="wave" />
           <Skeleton animation={false} />
         </Box>
         </center>
         :
         <CJobList jobs={jobs} />
      }
        </Container>
     
  );
}
