import styles from "../styles/DoctorRow.module.css";
import { FaUserAlt } from "react-icons/fa";
import { auth, db } from '../firebase-client/config'
import {
    getDoc,
    doc,
    getDocs,
    query,
    collection,
    where,
    addDoc,
    collectionGroup,
} from 'firebase/firestore';
import { useEffect, useState } from "react";
import NextLink from "next/link";

export default function DoctorRow({ details, selected = false, onClick }) {

    const [rating, setRating] = useState("");

    useEffect(() => {
        
        const fetchReviews = async () => {
            const reviewSnapshot = await getDocs(collection(db, `users/${details.uid}/reviews`));

            let sum = 0

            reviewSnapshot.docs.map((doc) => {
                sum += parseInt(doc.data().stars)
            });

            if (!reviewSnapshot.docs.length)
                setRating("N/A");
            else
                setRating(sum/reviewSnapshot.docs.length);
        }

        fetchReviews();

    }, []);

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
                <p className={styles.rating}><b>Rating: {rating}</b> </p>
                <p><NextLink className={styles.link} href={`/doctors/${details.uid}`}>Visit Profile</NextLink></p>
            </div>
        </div>
    )
}