function QuizResult({
  questions,
  answers,
  retry,
}) {

  const score = questions.reduce(
    (total, question, index) => {

      if (
        answers[index] === question.answer
      ) {
        return total + 1;
      }

      return total;

    },
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">

      <div className="bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center mb-6">
          🎉 Quiz Completed
        </h1>

        <div className="text-center mb-8">

          <p className="text-2xl font-semibold">

            Score

          </p>

          <p className="text-5xl font-bold text-green-600 mt-2">

            {score} / {questions.length}

          </p>

          <p className="text-gray-600 mt-2">

            {Math.round(
              (score / questions.length) * 100
            )}
            % Correct

          </p>

        </div>

        <div className="space-y-6">

          {questions.map((question, index) => {

            const correct =
              answers[index] === question.answer;

            return (

              <div
                key={index}
                className="border rounded-lg p-5"
              >

                <h3 className="font-semibold">

                  {index + 1}. {question.question}

                </h3>

                <p className="mt-2">

                  <strong>Your Answer:</strong>{" "}

                  <span
                    className={
                      correct
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {answers[index] || "Not Answered"}
                  </span>

                </p>

                <p className="mt-1">

                  <strong>Correct Answer:</strong>{" "}

                  <span className="text-green-600">

                    {question.answer}

                  </span>

                </p>

                <p className="mt-2 text-gray-700">

                  {question.explanation}

                </p>

              </div>

            );

          })}

        </div>

        <div className="text-center mt-8">

          <button
            onClick={retry}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            🔄 Retry Quiz
          </button>

        </div>

      </div>

    </div>
  );
}

export default QuizResult;