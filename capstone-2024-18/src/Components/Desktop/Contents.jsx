import classes from './DesktopPage.module.css';
import FunctionText from './FunctionText';
import TeamMember from './TeamMember';

function Contents() {
  const point_color = '#FF7871';
  return (
    <div id={classes.container}>
      <div style={{flexDirection: 'row', display: 'flex'}}>
        <img src={require('../../images/appproduce.png')} width={"20%"} style={{position: 'relative', margin: 0}}/>
        <div style={{paddingTop: 50, paddingLeft: 20, paddingRight: 20}}>
          <text style={{display: 'block'}}>1. 프로젝트 소개</text>
          <text style={{display: 'block'}}>페이스 프렌드(FaceFriend)는 기존의 데이팅 앱에서 사용자가 느꼈던 불편한 점들을 해결하기 위한 관상 기반 앱 서비스입니다.</text>
          <text>얼굴 노출의 부담, 얼굴 이미지에 대한 의존과 같은 문제를 해결하기 위해 페이스 프렌드는 5가지 기능을 제공합니다.</text>
        </div>
      </div>
      
      <text style={{display: 'block'}}>2. 기능 소개</text>
      <div style={{flexDirection:'row', display: 'flex'}}>
        <FunctionText title={"1. AI 관상 이미지"} contents={`얼굴 이미지를 업로드하고 자신과 비슷한 스타일 이미지를 선택하여 <span style='color: ${point_color};'>관상 이미지</span>를 생성합니다. 관상 이미지는 사용자의 얼굴 특징을 담아내어 실제 얼굴 이미지 대신 사용할 수 있습니다. <br><br>사용자는 상대의 관상 이미지를 보며 상대의 실제 얼굴을 유추하는 즐거움을 느낄 수 있습니다.`}/>
        <img src={require('../../images/face.png')} width={"20%"} style={{position: 'relative', margin: 0}}/>
      </div>
      <div style={{flexDirection:'row', display: 'flex'}}>
        <img src={require('../../images/face.png')} width={"20%"} style={{position: 'relative', margin: 0}}/>
        <FunctionText title={"2. AI 관상 분석"} contents={`얼굴 이미지를 업로드하여 관상을 분석합니다. <span style='color: ${point_color};'>눈썹, 눈, 코, 입, 얼굴형</span>에 대해 분석하고 <span style='color: ${point_color};'>관상학의 오행형(五行形)</span>에 따라 사용자는 <span style='color: ${point_color};'>화/수/목/금/토</span> 중 하나로 분류됩니다. <br><br> 사용자는 상대의 관상 분석을 보며 상대의 실제 성격을 유추하는 즐거움을 느낄 수 있습니다.`}/>
      </div>
      <div style={{flexDirection:'row', display: 'flex'}}>
        <FunctionText title={"3. AI 관상 궁합 추천"} contents={`AI 관상 분석의 결과로 사용자는 오행형이 분류됩니다. <span style='color: ${point_color};'>관상 궁합이 좋은 오행형</span>을 가진 다른 사용자들을 추천합니다. <br><br> 관상 궁합 추천 이외에도 관심분야별 추천 기능도 존재합니다.`}/>
        <img src={require('../../images/face.png')} width={"20%"} style={{position: 'relative', margin: 0}}/>
      </div>
      {/* <span style='color: ${point_color};'> */}
      <div style={{flexDirection:'row', display: 'flex'}}>
        <img src={require('../../images/face.png')} width={"20%"} style={{position: 'relative', margin: 0}}/>
        <FunctionText title={"4. 자기소개서"} contents={`AI 관상 이미지, AI 관상 분석 외에도 <span style='color: ${point_color};'>관심사 카테고리</span>를 선택하거나 <span style='color: ${point_color};'>글과 이미지</span>를 첨부하여 자신에 대해 소개할 수 있습니다. <br><br>상대방의 자기소개서를 읽고 마음에 든다면 하트를 보내 관심을 표현할 수 있습니다.`}/>
      </div>
      <div style={{flexDirection:'row', display: 'flex'}}>
        <FunctionText title={"5. 채팅"} contents={`하트를 수락한다면 채팅을 나눌 수 있습니다. 채팅을 나누며 친밀도가 증가할수록 <span style='color: ${point_color};'>서로의 관상 이미지는 실제 얼굴 이미지에 근접해집니다</span>.`}/>
        <img src={require('../../images/face.png')} width={"20%"} style={{position: 'relative', margin: 0}}/>
      </div>

      <text style={{display: 'block'}}>3. 서비스 구조</text>
      <img src={require('../../images/structure.png')} width={"100%"} style={{position: 'relative', margin: 0}}/>

      <text style={{display: 'block'}}>4. 사용법</text>
      <div style={{columnCount: 2, paddingLeft: '20%', paddingRight: '20%'}}>
        <div style={{width: '100%', textAlign: 'center', paddingBottom: 50}}>
          <text style={{display: 'block'}}>회원가입 및 로그인</text>
          <img src={require('../../images/signup2.gif')} width={"80%"} style={{position: 'relative', margin: 0}}/>
        </div>
        <div style={{width: '100%', textAlign: 'center', paddingBottom: 50}}>
          <text style={{display: 'block'}}>AI 이미지 생성</text>
          <img src={require('../../images/face2.gif')} width={"80%"} style={{position: 'relative', margin: 0}}/>
        </div>
        <div style={{width: '100%', textAlign: 'center', paddingBottom: 50}}>
          <text style={{display: 'block'}}>자기소개서</text>
          <img src={require('../../images/resume2.gif')} width={"80%"} style={{position: 'relative', margin: 0}}/>
        </div>
        <div style={{width: '100%', textAlign: 'center', paddingBottom: 50}}>
          <text style={{display: 'block'}}>기본정보</text>
          <img src={require('../../images/basic2.gif')} width={"80%"} style={{position: 'relative', margin: 0}}/>
        </div>
        <div style={{width: '100%', textAlign: 'center', paddingBottom: 50}}>
          <text style={{display: 'block'}}>AI 관상 분석</text>
          <img src={require('../../images/analyze2.gif')} width={"80%"} style={{position: 'relative', margin: 0}}/>
        </div>
        <div style={{width: '100%', textAlign: 'center', paddingBottom: 50}}>
          <text style={{display: 'block'}}>채팅</text>
          <img src={require('../../images/chat2.gif')} width={"80%"} style={{position: 'relative', margin: 0}}/>
        </div>
      </div>

      <text style={{display: 'block'}}>5. 팀소개</text>
      <TeamMember image={require('../../images/이시현.png')} name={"이시현 (AI)"} contents={`AI 관상 이미지<br>AI 관상 분석(눈, 입)`}/>
      <TeamMember image={require('../../images/박민희.png')} name={"박민희 (AI)"} contents={`Landmark 모델 통합<br>AI 관상 분석(눈썹, 코, 얼굴형)`}/>
      <TeamMember image={require('../../images/고명섭.png')} name={"고명섭 (FE)"} contents={`인증/인가, 기본정보<br>웹소켓 및 채팅`}/>
      <TeamMember image={require('../../images/윤민지.png')} name={"윤민지 (FE)"} contents={`AI 관상 이미지, AI 관상 분석<br>자기소개서, AI 관상 궁합 추천`}/>
      <TeamMember image={require('../../images/임장혁.png')} name={"임장혁 (BE)"} contents={`웹소켓 및 채팅<br>통합 테스트 환경 구축<br>AWS 배포`}/>
      <TeamMember image={require('../../images/김찬진.png')} name={"김찬진 (BE, 팀장)"} contents={`인증/인가, AI 관상 이미지, AI 관상 분석 연동<br>기본 정보, AI 관상 이미지, AI 관상 분석, 자기소개서<br>AI 관상 궁합 추천, 채팅방 내 친밀도에 따른 AI 관상 이미지 변화, AWS S3`}/>

      <text style={{display: 'block'}}>6. 문서(포스터)</text>
      <div style={{display: 'inline-block', backgroundColor: '#FF847D', padding: 10, borderRadius: 10}}>
        <a href='https://drive.google.com/drive/u/0/folders/15CNdGg8UGcZfr9XU2z3XRlWpkxXgrowY' style={{textDecoration: 'none',color: '#fff'}}>
          구글 드라이브 링크
        </a>
      </div>
      
    </div>
  );
}

export default Contents;
