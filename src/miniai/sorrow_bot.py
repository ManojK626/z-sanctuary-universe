from base_bot import BaseBot

class SorrowBot(BaseBot):
    """A Mini-AI bot that responds to sorrow events."""
    def receive(self, message):
        if message.get('type') == 'sorrow':
            self.state['sorrow_level'] = self.state.get('sorrow_level', 0) + message.get('intensity', 1)
    def act(self):
        if self.state.get('sorrow_level', 0) > 5:
            print(f"{self.name} is expressing sorrow.")
            self.state['sorrow_level'] = 0
