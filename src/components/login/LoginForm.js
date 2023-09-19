import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Typography, Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../iconify';
import { useDispatch, useSelector } from 'react-redux';
import { signin } from 'src/redux/actions/auth.action';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch(); 

  const userSignin = (e) => {
    e.preventDefault();
    setLoading(true);
    // const user = { email, password };
    // dispatch(signin(user, navigate, setLoading));
    navigate('/home');
  }

  return (
    <>
     <form onSubmit={userSignin}>
      <Stack spacing={2}>
      <Typography variant="subtitle1" style={{fontSize: '20px'}}><b>Username</b></Typography>
      <TextField
      required
      name="username"
      type="text"
      // label="Email address"
      onChange={(e) => setEmail(e.target.value)}
      sx={{ borderRadius: '12px', background: '#D9D9D921' }}
    />
      <Typography variant="subtitle1" style={{fontSize: '20px'}}><b>Client ID</b></Typography>
      <TextField
      required
      name="id"
      type="text"
      // label="Email address"
      onChange={(e) => setEmail(e.target.value)}
      sx={{ borderRadius: '12px', background: '#D9D9D921' }}
    />

    <Typography variant="subtitle1" style={{fontSize: '20px'}}><b>Password</b></Typography>
        <TextField
          name="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          sx={{ borderRadius: '12px', background: '#D9D9D921' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>


      <LoadingButton fullWidth size="large" type="submit" disabled={loading} style={{marginTop: '30px', paddingTop: '7%', paddingBottom: '7%', backgroundColor: '#15197ED9', color: 'white'}}>
        {loading ? "Loading..." : "Login"}
      </LoadingButton>
      <Typography variant="body2" sx={{ mt: 2, mb: 2, color: '#21D0C3', textAlign: 'center' }}>
              <Link href='/register' variant="subtitle2"><span style={{color: 'black' }}>Forgot Password?</span></Link>
            </Typography>
      </form>
    </>
  );
}
