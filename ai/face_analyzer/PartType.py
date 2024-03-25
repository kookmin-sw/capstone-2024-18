from FaceComponent import FaceComponent

class PartType(FaceComponent):

    def __init__(self, name, description):
        self.name=name
        self.description=description
    
    def getName(self) -> str:
        return self.name

    def getDescription(self) -> str:
        return self.description

    def _print(self):
        print(self.name+": "+self.description)
        return
