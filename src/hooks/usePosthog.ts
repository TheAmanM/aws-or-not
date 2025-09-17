import posthog from "posthog-js";

const POSTHOG_ATTEMPT_KEY = "attempted_question";

export function usePosthog() {
  const captureAttempt = ({
    real_aws_service,
    fake_aws_service,
    selected_answer,
    is_correct,
    time_to_answer_ms,
    question_pair_id,
  }: {
    real_aws_service: string;
    fake_aws_service: string;
    selected_answer: string;
    is_correct: boolean;
    time_to_answer_ms: number;
    question_pair_id: string;
  }) => {
    console.log("Capturing attempt:");

    posthog.capture(POSTHOG_ATTEMPT_KEY, {
      real_aws_service,
      fake_aws_service,
      selected_answer,
      is_correct,
      time_to_answer_ms,
      question_pair_id,
    });
  };

  return { captureAttempt };
}
