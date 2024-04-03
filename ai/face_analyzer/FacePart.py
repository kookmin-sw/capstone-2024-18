from FaceComponent import FaceComponent

class FacePart(FaceComponent):
    def __init__(self, name='', description=''):
        self.name=name
        self.description=description
        self.faceComponents = {}
        
    def add(self,faceComponent: FaceComponent):
        self.faceComponents[faceComponent.getName()] = faceComponent
    
    def remove(self, faceComponent: FaceComponent):
        del self.faceComponents[faceComponent.getName()]

    def getChild(self, name) -> FaceComponent:
        return self.faceComponents[name]

    def getName(self) -> str:
        return self.name

    def getDescription(self) -> str:
        return self.description
    
    def analyze(self,landmarks_mash,landmark_1000):
        result = {}
        for name, faceComponent in self.faceComponents.items():
            result[name]=faceComponent.analyze(landmarks_mash,landmark_1000)
        return result

    def __str__(self):
        return self.name+": "+self.description
    
    def _print(self):
        print(self.name+": "+self.description)
        for name, faceComponent in self.faceComponents.items():
            faceComponent._print()
