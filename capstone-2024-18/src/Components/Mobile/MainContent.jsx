import Button from './Button'
import Card from './Card'
import classes from "./MainContent.module.css"
import Profile from './Profile'

const MainContent = () => {
  return (
    <main className={classes.container}>

      <section className={classes["section-outer-container"]}>
        <div className={classes["section-image-container"]}>
          <img className={classes["section-image"]} src={`${process.env.PUBLIC_URL}/section1.png`} alt="screen example 1" />
        </div>
        <div className={classes["section-text-container"]}>
          <h2 className={classes["section-first-title"]}>1. 프로젝트 소개</h2>
          <p className={classes["section-text"]}>
            <span className='primary bold'>페이스 프렌드(FaceFriend)</span>는 기존의 데이팅 앱에서 사용자가 느꼈던 불편한 점들을 해결하기 위한 관상 기반 앱 서비스입니다.<br/>
            <br/>
            <span className='primary bold'>얼굴 노출의 부담, 얼굴 이미지에 대한 의존</span>과 같은 문제를 해결하기 위해 페이스 프렌드는 <span className='primary bold'>5가지 기능</span>을 제공합니다.</p>
        </div>
      </section>

      <h2 className={classes["section-title"]}>2. 기능 소개</h2>
      <section className={classes["section-outer-container"]}>
        <div className={classes["section-inner-container"]}>
          <Card title="1. AI 관상 이미지">
            얼굴 이미지를 업로드하고 자신과 비슷한 스타일 
            이미지를 선택하여 <span className='primary bold'>관상 이미지</span>를 생성합니다.
            관상 이미지는 사용자의 얼굴 특징을 담아내어 
            실제 얼굴 이미지 대신 사용할 수 있습니다.<br/>
            <br/>
            사용자는 상대의 관상 이미지를 보며 상대의 실제 
            얼굴을 유추하는 즐거움을 느낄 수 있습니다.
          </Card>
          <div className={classes["section-image-container"]}>
            <img 
              className={classes["section-image"]} 
              src={`${process.env.PUBLIC_URL}/section1.png`} 
              alt="screen example 1" 
            />
          </div>
        </div>
      </section>

      <section className={classes["section-outer-container"]}>
        <div className={classes["section-inner-container"]}>
          <div className={classes["section-image-container"]}>
            <img 
              className={classes["section-image"]} 
              src={`${process.env.PUBLIC_URL}/section1.png`} 
              alt="screen example 1" 
            />
          </div>
          <Card title="2. AI 관상 분석">
            얼굴 이미지를 업로드하여 관상을 분석합니다.
            <span className='primary bold'> 눈썹, 눈, 코, 입, 얼굴형</span>에 대해 분석하고 
            <span className='primary bold'> 관상학의 오행형(五行形)</span>에 따라 사용자는 
            <span className='primary bold'> 화/수/목/금/토</span> 중 하나로 분류됩니다.<br/>
            <br/>
            사용자는 상대의 관상 분석을 보며 상대의 실제
            성격을 유추하는 즐거움을 느낄 수 있습니다.
          </Card>
        </div>
      </section>

      <section className={`${classes["section-outer-container"]} background`}>
        <div className={classes["section-inner-container"]}>
          <Card title="3. AI 관상 궁합 추천">
            AI 관상 분석의 결과로 사용자는 오행형이 
            분류됩니다. <span className='primary bold'> 관상 궁합이 좋은 오행형</span>을 가진 
            다른 사용자들을 추천합니다. <br/>
            <br/>
            관상 궁합 추천 이외에도 관심분야별 추천 
            기능도 존재합니다.
          </Card>
          <div className={classes["section-image-container"]}>
            <img 
              className={classes["section-image"]} 
              src={`${process.env.PUBLIC_URL}/section1.png`} 
              alt="screen example 1" 
            />
          </div>
        </div>
      </section>

      <section className={`${classes["section-outer-container"]} background`}>
        <div className={classes["section-inner-container"]}>
          <div className={classes["section-image-container"]}>
            <img 
              className={classes["section-image"]} 
              src={`${process.env.PUBLIC_URL}/section1.png`} 
              alt="screen example 1" 
            />
          </div>
          <Card title="4. 자기소개서">
            AI 관상 이미지, AI 관상 분석 외에도 <span className='primary bold'> 관심사 카테고리</span>를
            선택하거나 <span className='primary bold'> 글과 이미지</span>를 첨부하여 자신에
            대해 소개할 수 있습니다.<br/>
            <br/>
            상대방의 자기소개서를 읽고 마음에 든다면
            하트를 보내 관심을 표현할 수 있습니다.
          </Card>
        </div>
      </section>

      <section className={`${classes["section-outer-container"]} background`}>
        <div className={classes["section-inner-container"]}>
          <Card title="5. 채팅">
            하트를 수락한다면 채팅을 나눌 수 있습니다.
            채팅을 나누며 친밀도가 증가할수록 <span className='primary bold'>서로의 관상 
            이미지는 실제 얼굴 이미지에 근접해집니다.</span>
          </Card>
          <div className={classes["section-image-container"]}>
            <img 
              className={classes["section-image"]} 
              src={`${process.env.PUBLIC_URL}/section1.png`} 
              alt="screen example 1" 
            />
          </div>
        </div>
      </section>

      <h2 className={`${classes["section-title"]} background`}>3. 서비스 구조</h2>
      <section className={`${classes["section-outer-container"]} background`}>
        <Card>
          <img src={`${process.env.PUBLIC_URL}/system_architecture.png`} alt="system architecture" width="300px"/>
        </Card>
      </section>

      <h2 className={`${classes["section-title"]} background`}><br/><br/>4. 시연영상<br/><br/>회원가입 및 로그인</h2>

      <section className={`${classes["section-outer-container"]} background`}>
        <img src={`${process.env.PUBLIC_URL}/demo1.gif`} alt="system architecture" width="300px"/>
      </section>

      <h2 className={`${classes["section-title"]} background`}><br/><br/>기본정보<br/><br/></h2>

      <section className={`${classes["section-outer-container"]} background`}>
        <img src={`${process.env.PUBLIC_URL}/demo2.gif`} alt="system architecture" width="300px"/>
      </section>

      <h2 className={`${classes["section-title"]} background`}><br/><br/>AI 관상 이미지<br/><br/></h2>

      <section className={`${classes["section-outer-container"]} background`}>
        <img src={`${process.env.PUBLIC_URL}/demo3.gif`} alt="system architecture" width="300px"/>
      </section>

      <h2 className={`${classes["section-title"]} background`}><br/><br/>AI 관상 분석<br/><br/></h2>

      <section className={`${classes["section-outer-container"]} background`}>
        <img src={`${process.env.PUBLIC_URL}/demo4.gif`} alt="system architecture" width="300px"/>
      </section>

      <h2 className={`${classes["section-title"]} background`}><br/><br/>자기소개서<br/><br/></h2>

      <section className={`${classes["section-outer-container"]} background`}>
        <img src={`${process.env.PUBLIC_URL}/demo5.gif`} alt="system architecture" width="300px"/>
      </section>

      <h2 className={`${classes["section-title"]} background`}><br/><br/>채팅<br/><br/></h2>

      <section className={`${classes["section-outer-container"]} background`}>
        <img src={`${process.env.PUBLIC_URL}/demo6.gif`} alt="system architecture" width="300px"/>
      </section>

      <h2 className={`${classes["section-title"]} background`}><br/><br/>5. 팀 소개<br/><br/></h2>
        <div className={`${classes["profile-container"]} background`}>
          <Profile src={`${process.env.PUBLIC_URL}/profile1.png`} alt="profile image">
            Name: 이시현<br/>
            Student ID : 20181664<br/>
            Role : 인공지능
          </Profile>
          <Profile src={`${process.env.PUBLIC_URL}/profile2.png`} alt="profile image">
            Name: 박민희<br/>
            Student ID : 20203066<br/>
            Role : 인공지능
          </Profile>
          <Profile src={`${process.env.PUBLIC_URL}/profile3.png`} alt="profile image">
            Name: 고명섭<br/>
            Student ID : 20181572<br/>
            Role : 프론트엔드
          </Profile>
          <Profile src={`${process.env.PUBLIC_URL}/profile4.png`} alt="profile image">
            Name: 윤민지<br/>
            Student ID : 20203108<br/>
            Role : 프론트엔드
          </Profile>
          <Profile src={`${process.env.PUBLIC_URL}/profile5.png`} alt="profile image">
            Name: 임장혁<br/>
            Student ID : 20190269<br/>
            Role : 백엔드
          </Profile>
          <Profile src={`${process.env.PUBLIC_URL}/profile6.png`} alt="profile image">
            Name: 김찬진<br/>
            Student ID : 20170897<br/>
            Role : 백엔드, 팀장
          </Profile>
        </div>
      <h2 className={`${classes["section-title"]} background`}><br/><br/>6. 문서<br/><br/></h2>
      <div className={`${classes["button-container"]} background`}>
        <a href='https://drive.google.com/drive/u/0/folders/15CNdGg8UGcZfr9XU2z3XRlWpkxXgrowY'>
          <Button>구글 드라이브 링크</Button>
        </a>
      </div>
    </main>
  )
}

export default MainContent