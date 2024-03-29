import { collection, getDocs } from 'firebase/firestore';
import { useEffect } from 'react';
import { db } from '../../firesbase';
import Header from '../commons/Header';
import User from '../commons/User';
import Card from '../commons/Card';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { init } from '../../redux/modules/posts';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firesbase';
import { loginUser, logoutUser } from '../../redux/modules/user';

function MainPage() {
  const posts = useSelector(function (item) {
    return item.posts;
  });
  const user = useSelector(function (item) {
    return item.user;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'posts'));

      const initialPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      dispatch(init(initialPosts));
    };
    fetchData();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        let nickName = '';

        const getUsers = async () => {
          const querySnapshot = await getDocs(collection(db, 'users'));

          const users = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          return users;
        };

        const users = await getUsers();
        const loggedUser = users.find((u) => u.email === user.email);

        dispatch(
          loginUser({
            email: loggedUser.email,
            nickName: loggedUser.nickName,
            isLogin: true,
          })
        );
      } else {
        dispatch(logoutUser());
      }
    });
  }, []);

  return (
    <>
      <Header />
      <Parents>
        <Wrapper>
          <User />
          {posts.length > 0 ? (
            <Card />
          ) : (
            <NoPosts>작성된 게시글이 없습니다.</NoPosts>
          )}
        </Wrapper>
      </Parents>
    </>
  );
}

export default MainPage;

export const Parents = styled.div`
  width: 100%;
  background-color: #1c1c20 !important;
  color: #fff !important;
  border-radius: 20px;
`;

export const Wrapper = styled.div`
  display: flex;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    flex-wrap: wrap;
  }
`;

const NoPosts = styled.div`
  display: flex;
  width: 1000px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  font-size: 28px;
  font-weight: bold;
`;
