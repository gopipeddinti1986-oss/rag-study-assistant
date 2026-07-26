import { useState } from "react";
import { generateQuiz } from "../api/api";
import QuizCard from "../components/QuizCard";
import QuizResult from "../components/QuizResult";

function Quiz() {
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(10);

  const [questions, setQuestions] = useState([]);

  const [current, setCurrent] = useState(0);

  const [answers, setAnswers] = useState({});

  const [loading, setLoading] = useState(false);

  const [finished, setFinished] = useState(false);

  const loadQuiz = async () => {
    setLoading(true);

    try {
      const data = await generateQuiz(
        difficulty,
        count
      );

      setQuestions(data.questions);

      setCurrent(0);

      setAnswers({});

      setFinished(false);

    } catch (err) {
      alert("Failed to generate quiz.");
    }

    setLoading(false);
  };

  const selectAnswer = (option) => {
    setAnswers({
      ...answers,
      [current]: option,
    });
  };

  const next = () => {
    if (current === questions.length - 1) {
      setFinished(true);
    } else {
      setCurrent(current + 1);
    }
  };

  const previous = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  if (finished) {
    return (
      <QuizResult
        questions={questions}
        answers={answers}
        retry={loadQuiz}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        AI Quiz Generator
      </h1>

      <div className="flex gap-4 mb-6">

        <select
          className="border p-2 rounded"
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value)
          }
        >
          <option value="easy">
            Easy
          </option>

          <option value="medium">
            Medium
          </option>

          <option value="hard">
            Hard
          </option>

        </select>

        <select
          className="border p-2 rounded"
          value={count}
          onChange={(e) =>
            setCount(Number(e.target.value))
          }
        >
          <option>5</option>
          <option>10</option>
          <option>20</option>
        </select>

        <button
          onClick={loadQuiz}
          className="bg-blue-600 text-white px-4 rounded"
        >
          {loading
            ? "Generating..."
            : "Generate Quiz"}
        </button>

      </div>

      {questions.length > 0 && (

        <>

          <div className="mb-3 font-semibold">

            Question {current + 1} of {questions.length}

          </div>

          <div className="w-full bg-gray-200 rounded h-3 mb-6">

            <div
              className="bg-green-500 h-3 rounded"
              style={{
                width:
                  `${((current + 1) / questions.length) * 100}%`,
              }}
            />

          </div>

          <QuizCard
            question={questions[current]}
            selected={answers[current]}
            onSelect={selectAnswer}
          />

          <div className="flex justify-between mt-6">

            <button
              onClick={previous}
              disabled={current === 0}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Previous
            </button>

            <button
              onClick={next}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {current === questions.length - 1
                ? "Finish"
                : "Next"}
            </button>

          </div>

        </>

      )}

    </div>
  );
}

export default Quiz;