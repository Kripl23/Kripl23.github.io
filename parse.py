# import asyncio
# import os

# from bungio import Client
# from bungio.models import BungieMembershipType, DestinyActivityModeType, DestinyUser, DestinyCharacter
# from bungio.models.mixins.character import DestinyCharacterMixin


# # create the client obj with our bungie authentication
# client = Client(
#     bungie_client_id="45166",
#     bungie_client_secret="fr9D6R8kAUxsu37g62py4cHeJWsP99m1xz21PislfC0",
#     bungie_token="f7fca28cdc57415e8681f184e6dbf47b",
# )

# async def main():
#     character = DestinyCharacterMixin()
#     print(character.get_vendors(400, 0))

# asyncio.run(main())

from bungio import BungieAPI
from bungio.models import BungieMembershipType

api_key = 'f7fca28cdc57415e8681f184e6dbf47b' 
client = BungieAPI(api_key)
vendors = client.get_vendors(
        membership_type=BungieMembershipType.Destiny2,
        destiny_membership_id=76561198085401057
        )
for vendor in vendors:
    print(vendor.vendor_hash) 
    print(vendor.vendor.name)






