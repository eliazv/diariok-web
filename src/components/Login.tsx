type LoginProps = {
  handleLogin: () => void;
};

const Login = ({ handleLogin }: LoginProps) => {
  return (
    <div className="login">
      <div className="login-container">
        <p className="login-title">Diariok</p>
        <button onClick={handleLogin} className="login-button">
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
