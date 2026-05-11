from base_bot import BaseBot

class JoyBot(BaseBot):
    """A Mini-AI bot that responds to joy events."""
    def receive(self, message):
        if message.get('type') == 'joy':
            self.state['joy_level'] = self.state.get('joy_level', 0) + message.get('intensity', 1)
    def act(self):
        if self.state.get('joy_level', 0) > 10:
            print(f"{self.name} is radiating joy!")
            self.state['joy_level'] = 0
