import { CircularProgress } from "@mui/material";

const Loading: React.FC = () => {
  return (
    <div className="loading-container">
      <CircularProgress />
      <h6>Authenticating...</h6>
    </div>
  );
};
export default Loading;
