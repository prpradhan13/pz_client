

function BtnLoading() {
  return (
    <svg viewBox="25 25 50 50" className="w-[2rem] animate-dash">
        <circle r="20" cy="50" cx="50" className="fill-none stroke-borderColor stroke-[4px] animate-dash" style={{strokeDasharray: "1, 200",  strokeDashoffset: "0", strokeLinecap: "round"}}></circle>
    </svg>
  )
}

export default BtnLoading
