import usePage from "../../hooks/usePage";


export default function PageNav() {

    const page = usePage();

    return (
        <div className="flex gap-3">
            <div className="cursor-pointer" onClick={page.previous}>{"<"}</div>
            <div>{`Page ${page.current + 1} of ${page.total}`}</div>
            <div className="cursor-pointer" onClick={page.next}>{">"}</div>
        </div>
    );
}