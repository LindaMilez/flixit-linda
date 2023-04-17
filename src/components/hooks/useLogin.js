import { useSelector } from 'react-redux';

const useLogin = () => {
  const { user } = useSelector(state => ({
    user: state.user
  }));

  if (user.email) {
    return user;
  }
  return false;
}

export default useLogin;