import Error from "../shared/Error";
import Question from "../assets/question.svg?react";

export default function NotFound() {
  return (
    <Error
      icon={Question}
      title="Page not found"
      description="The page you are looking for does not exist."
    />
  );
}
