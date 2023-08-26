type GameTextDisplayProps = {
    text: string;
    index: number;
}

export default function GameTextDisplay({text, index}: GameTextDisplayProps) {

    return (
        <div>
            <span className="text-green-500">{text.slice(0, index)}</span>{text.slice(index)}<span className="text-grey-800"></span>
        </div>
    );
}