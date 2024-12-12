import { Link} from "react-router-dom";

function Home(){
    return(
        <>
            <h2>Welcome to Home Page!</h2>
            <Link to='/dashboard'></Link>
        </>
    );
}

export default Home;