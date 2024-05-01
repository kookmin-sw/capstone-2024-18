from FaceComponent import FaceComponent

class PartType(FaceComponent):

    def __init__(self):
        self.name=""
        self.description=""
        self.tag=[]
        self.id_num = ""

    def getName(self) -> str:
        return self.name

    def getDescription(self) -> str:
        return self.description

    def analyze(self, landmarks_mash, landmark_1000):
        raise NotImplementedError("This function is not yet implemented")

    def _print(self):
        print(self.name+": "+self.description)
        return
    
