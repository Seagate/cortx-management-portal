from mongoengine import *

connect('notes')

class Notes(Document):
    title = StringField(max_lenth=50, required=True)
    description = StringField(max_lenth=50, required=True)
    created_at = StringField(max_lenth=50, required=True)
    created_by = StringField(max_lenth=50, required=True)
    priority = IntField()
