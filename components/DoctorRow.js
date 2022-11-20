import styles from "../styles/DoctorRow.module.css";
import { FaUserAlt } from "react-icons/fa";

export default function DoctorRow({ details, selected = false, onClick }) {
    return (
        <div 
            className={styles.container}
            style={{ border: `solid ${ selected ? "2px #4eaa7b" : " 1px #e6e6e6" }` }}
            onClick={() => onClick && onClick(details)}
        >
            <FaUserAlt size={40} color="#d4d4d4" className={styles.profile_pic}/>
            <div className={styles.details}>
                <p className={styles.name}>{details?.firstName} {details?.lastName}</p>
                <p className={styles.specialty}><b>Specialty:</b> {details?.specialty}</p>
                <p className={styles.rating}><b>Rating:</b> </p>
            </div>
        </div>
    )
}