import styled from 'styled-components';
import { db } from '../../firesbase';
import { deleteDoc, doc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../commons/Header';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost } from '../../redux/modules/posts';

const DetailPage = () => {
  const { posts, user } = useSelector(function (item) {
    return item;
  });

  const { id: postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const post = posts.find(function (p) {
    return p.id === postId;
  });

  const moveToWritePage = () => {
    navigate(`/writepage/${post.id}`);
  };

  const onDeletePostButtonClick = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        const postRef = doc(db, 'posts', post.id);
        await deleteDoc(postRef);

        dispatch(deletePost(post.id));
        navigate('/');
      } catch (error) {
        alert('알수없는 오류가 발생 하였습니다.');
        console.error('Error deleting document: ', error);
      }
    }
  };
  return (
    <div>
      <Header />
      <StPageWide>
        <div>
          <Wrapper key={post.id}>
            <StTitleWriteBox>
              <StTitle>{post.title}</StTitle>
              <StNickNameCreatedAt>
                {post.nickName} | {post.createdAt}
              </StNickNameCreatedAt>
            </StTitleWriteBox>
            <StContentWriteBox>{post.content}</StContentWriteBox>
            <StWriteCancleCompleteBtn>
              {user.email === post.email ? (
                <>
                  <Stbtn onClick={moveToWritePage}>Edit</Stbtn>
                  <Stbtn onClick={onDeletePostButtonClick}>Delete</Stbtn>
                </>
              ) : (
                ''
              )}
            </StWriteCancleCompleteBtn>
          </Wrapper>
        </div>
      </StPageWide>
    </div>
  );
};

DetailPage.propTypes = {
  posts: PropTypes.array.isRequired,
  setPosts: PropTypes.func.isRequired,
};

export default DetailPage;
const Wrapper = styled.div`
  @media screen and (max-width: 390px) {

`;

const StPageWide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-weight: 200;
  width: 100%;
  height: 800px;
  margin: 0 auto;
  background-color: #1c1c20 !important;
  color: #fff !important;
  border-radius: 20px;
  font-size: x-large;
  @media screen and (max-width: 390px) {
    margin: 15px auto;
`;

const StTitleWriteBox = styled.div`
  margin: 15px auto;
  display: flex;
  flex-direction: column;
  padding: 15px 20px;
  box-sizing: border-box;
  font-size: 22px;
  line-height: 230%;
  font-weight: bold;
  letter-spacing: -0.02px;
  color: #7472e7;
`;

const StTitle = styled.div`
  color: #7472e7;
  font-size: 36px;
`;

const StNickNameCreatedAt = styled.div`
  color: #aaa;
  font-size: 18px;
`;

const StContentWriteBox = styled.div`
  height: 100px;
  padding: 10px 20px;
  background-color: #1c1c20;
  font-size: 28px;
  font-weight: 600;
  box-sizing: border-box;
`;

const StWriteCancleCompleteBtn = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 20px 30px 0 0;
`;

const Stbtn = styled.button`
  border: none;
  margin: 10px;
  padding: 10px;
  font-size: medium;
  color: white;
  background-color: #3e3e3e;
  border-radius: 10px;
`;
