import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import useStore from "../store";
import { useNavigate } from "react-router-dom";

const useApp = () => {
  const navigate = useNavigate();
  const {
    currentUser: { uid },
  } = getAuth();
  const boardsColRef = collection(db, `users/${uid}/boards`);
  const { boards, setBoards, addBoard, setToastr } = useStore();

  const deleteBoard = async (boardId) => {
    try {
      // delete the board document
      const boardDocRef = doc(db, `users/${uid}/boards/${boardId}`);
      await deleteDoc(boardDocRef);

      // delete the associated boardsData document
      const boardDataDocRef = doc(db, `users/${uid}/boardsData/${boardId}`);
      await deleteDoc(boardDataDocRef);

      // update the boards in the store
      const tBoards = boards.filter((board) => board.id !== boardId);
      setBoards(tBoards);

      // navigate to the boards screen
      navigate("/boards");
    } catch (err) {
      setToastr("Error deleting the board");
      throw err;
    }
  };

  const updateBoardData = async (boardId, tabs) => {
    const docRef = doc(db, `users/${uid}/boardsData/${boardId}`);
    try {
      await updateDoc(docRef, { tabs, lastUpdated: serverTimestamp() });
    } catch (err) {
      setToastr("Error updating board");
      throw err;
    }
  };

  const fetchBoard = async (boardId) => {
    const docRef = doc(db, `users/${uid}/boardsData/${boardId}`);
    try {
      const doc = await getDoc(docRef);
      if (doc.exists) {
        return doc.data();
      } else return null;
    } catch (err) {
      setToastr("Error fetching board");
      throw err;
    }
  };

  const createBoard = async ({ name, color }) => {
    try {
      const boardDoc = await addDoc(boardsColRef, {
        name,
        color,
        createdAt: serverTimestamp(),
      });

      // Create the associated boardsData document
      const boardDataDocRef = doc(db, `users/${uid}/boardsData/${boardDoc.id}`);
      await setDoc(boardDataDocRef, {
        tabs: {
          todos: [],
          inProgress: [],
          completed: [],
        },
        lastUpdated: serverTimestamp(),
      });

      addBoard({
        name,
        color,
        createdAt: new Date().toLocaleString("en-US"),
        id: boardDoc.id,
      });
    } catch (err) {
      setToastr("Error creating board");
      throw err;
    }
  };

  const fetchBoards = async (setLoading) => {
    try {
      const q = query(boardsColRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const boards = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt.toDate().toLocaleString("en-US"),
      }));

      setBoards(boards);
    } catch (err) {
      setToastr("Error fetching boards");
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  return { createBoard, fetchBoards, fetchBoard, updateBoardData, deleteBoard };
};

export default useApp;
