### FaceComponent 클래스
컴포지트 패턴에서 Component 추상클래스에 대응되는 클래스가 FaceComponent 클래스입니다.
Leaf 노드와 Inner 노드가 가져야할 메소드를 모두 가지고 있어야하기에 추상클래스를 명시적으로 만들 수 없어 해당 클래스로 인스턴스를 만들어 메소드를 호출하면 에러를 반환하도록 하였습니다.

```python
from abc import *

class FaceComponent(metaclass=ABCMeta):


    def add(self, faceComponent):
        raise NotImplementedError("This function is not yet implemented")
    

    def remove(self, faceComponent):
        raise NotImplementedError("This function is not yet implemented")
    

    def getChild(self, faceComponent):
        raise NotImplementedError("This function is not yet implemented")
    

    def getName(self) -> str:
        raise NotImplementedError("This function is not yet implemented")
    

    def getDescription(self) -> str:
        raise NotImplementedError("This function is not yet implemented")
    
    def analyze(self, landmarks_mash,landmark_1000):
        raise NotImplementedError("This function is not yet implemented")
    
    def chooseChildByPolicy(self):
        raise NotImplementedError("This function is not yet implemented")
```

### FacePart 클래스
Inner 노드에 해당하는 클래스이고 자식 노드들은 딕셔너리로 관리하고 있습니다. 해당 클래스를 상속하는 자식클래스를 만들 일은 없지만 추후 만약 만들게 된다면 멤버변수를 꼭 생성자 안에서 만들어야 의도하지 않은 static 변수생성을 예방할 수 있습니다.

_print()함수와 analyze함수는 자식 노드들을 재귀적으로 호출합니다.



### PartType 클래스
Leaf 노드에 해당하는 클래스입니다. 앞으로 이 클래스를 상속받아 세부적인 유형 클래스들을 만들어야합니다. 


### PartType 클래스를 상속 받는 세부유형 클래스
담당하는 부위폴더(ex. 눈이면 eye 폴더)를 만들고 그 안에 세부 유형 클래스를 만듭니다. 이 때 PartType클래스를 상속받아 만들어줍니다. 세부유형 클래스는 analyze 메소드를 필수적으로 가지고 있어야 합니다. 또한 analyze 함수는 숫자하나를 리턴해야 합니다.


### class_info.py 파일
사용하고자 하는 세부 유형을 만들었다면 class_info.py 파일 안에 해당 클래스를 넣어주세요. (파일 이름을 넣으시면 안되고 클래스 이름을 넣어주셔야합니다. = 패키지를 넣으면 안되고 모듈을 넣어야합니다.) 
예를 들어 독수리 눈 클래스를 만들었다면 눈을 담당하는 eye key값의 value 리스트에 EagleEye 클래스를 넣어주시면 됩니다.
각각의 세부 유형을 어떤 정책으로 선택할지 선택할 함수를 policy key값의 value로 넣어주세요 policy함수는 딕셔너리를 입력으로 받아서 하나의 문자열을 리턴하는 함수입니다. 이 때 문자열은 입력으로 들어온
딕셔너리의 key 값중 하나여야합니다.


### face_analyze.py 파일
class_info.py 파일을 기반으로 트리 모양의 관계를 만드는 코드입니다. face 객체가 root 노드이고 해당 노드의 자식들은 부위를 나타내고 그 부위의 자식들은 세부유형을 나타냅니다.
담당하는 부위의 관상분석을 하고 싶을 땐 face 객체의 faceComponents 딕셔너리를 이용하여 해당 노드를 가져와 사용하면 됩니다.

getType 함수는 저장된 이미지 경로를 입력으로 주면 해당 이미지의 얼굴을 분석하여 세부유형 오브젝트들이 담긴 리스트를 반환합니다.