import Error from "../shared/Error";
import { ReactComponent as Question } from "../assets/question.svg";

export default function NotFound() {
  return (
    <Error
      icon={Question}
      title="Page not found"
      description="The page you are looking for does not exist."
    />
  );
}
