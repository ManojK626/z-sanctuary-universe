from joy_bot import JoyBot
from sorrow_bot import SorrowBot
from harmony_bot import HarmonyBot
from message_bus import MessageBus

if __name__ == "__main__":
    bus = MessageBus()
    joy_bot = JoyBot("JoyBot")
    sorrow_bot = SorrowBot("SorrowBot")
    harmony_bot = HarmonyBot("HarmonyBot")
    # Subscribe all bots to the bus
    for bot in [joy_bot, sorrow_bot, harmony_bot]:
        bus.subscribe(bot)
    # Simulate events
    for i in range(12):
        bus.publish({'type': 'joy', 'intensity': 1})
        bus.publish({'type': 'sorrow', 'intensity': 1})
        bus.publish({'type': 'harmony', 'intensity': 1})
        for bot in [joy_bot, sorrow_bot, harmony_bot]:
            bot.act()
    print("Final states:")
    for bot in [joy_bot, sorrow_bot, harmony_bot]:
        print(bot.name, bot.report())
