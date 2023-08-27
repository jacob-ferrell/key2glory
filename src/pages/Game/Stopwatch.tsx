type StopwatchProps = {
    elapsedTime: number;
}

export default function Stopwatch({elapsedTime}: StopwatchProps) {

    function renderDigits() {
        const formattedElapsedTime = formatElapsedTime();
        const digits = formattedElapsedTime.split('');
        return digits.map((digit, index) => {
            return <div key={index} className="text-4xl h-full w-5">{digit}</div>
        })
    }
    function formatElapsedTime() {
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = Math.floor(elapsedTime % 60);
        const tenthsAndHundreths = (elapsedTime % 1).toFixed(2).substring(2);
      
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
      
        return `${formattedMinutes}:${formattedSeconds}.${tenthsAndHundreths}`;
      }

    return (
        <div className="flex flex-col items-center bg-zinc-700 rounded shadow px-20">
            <div className="flex">{renderDigits()}</div>
            <span className="text-2xl">seconds</span>
        </div>
    );
}