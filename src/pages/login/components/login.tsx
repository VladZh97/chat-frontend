import { useLinkAuth } from '@/hooks';

const Login = () => {
  useLinkAuth();
  return <div>Login</div>;
};

export default Login;
