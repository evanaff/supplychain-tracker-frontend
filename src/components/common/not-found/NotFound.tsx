import "./NotFound.css";

import { FiSearch } from "react-icons/fi";

type Props = {
    title?: string;
    description?: string;
};

function NotFound({
    title = "Data Not Found",
    description = "The requested resource could not be found.",
}: Props) {
    return (
        <div className="not-found-container">
            <div className="not-found-icon">
                <FiSearch />
            </div>

            <h2>{title}</h2>

            <p>{description}</p>
        </div>
    );
}

export default NotFound;