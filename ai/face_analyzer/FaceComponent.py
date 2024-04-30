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
    
    def getTag(self) -> str:
        raise NotImplementedError("This function is not yet implemented")

    def analyze(self, landmarks_mash,landmark_1000):
        raise NotImplementedError("This function is not yet implemented")
    
    def chooseChildByPolicy(self):
        raise NotImplementedError("This function is not yet implemented")