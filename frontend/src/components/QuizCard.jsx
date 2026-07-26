function QuizCard({
  question,
  selected,
  onSelect,
}) {
  if (!question) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-xl font-semibold mb-6">
        {question.question}
      </h2>

      <div className="space-y-3">

        {question.options.map((option, index) => (

          <button
            key={index}
            onClick={() => onSelect(option)}
            className={`w-full text-left p-4 rounded-lg border transition
              ${
                selected === option
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
          >
            {option}
          </button>

        ))}

      </div>

    </div>
  );
}

export default QuizCard;