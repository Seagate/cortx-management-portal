import inspect
import json
from collections import OrderedDict
from models import Notes
from aiohttp.web_exceptions import HTTPMethodNotAllowed, HTTPBadRequest
from aiohttp.web import Request, Response
from aiohttp.web_urldispatcher import UrlDispatcher

def dbglog(*args, **kwargs):
    print(*args, **kwargs)

__version__ = '0.1.0'


DEFAULT_METHODS = ('GET', 'POST', 'PUT', 'DELETE')

class RestEndpoint:
    def __init__(self):
        self.methods = {}

        for method_name in DEFAULT_METHODS:
            method = getattr(self, method_name.lower(), None)
            if method:
                self.register_method(method_name, method)

    def register_method(self, method_name, method):
        self.methods[method_name.upper()] = method

    async def dispatch(self, request: Request):
        method = self.methods.get(request.method.upper())
        if not method:
            raise HTTPMethodNotAllowed('', DEFAULT_METHODS)

        mname = method.__name__
        dbglog(f'dispatch {mname}')

        wanted_args = list(inspect.signature(method).parameters.keys())
        available_args = request.match_info.copy()
        available_args.update({'request': request})

        unsatisfied_args = set(wanted_args) - set(available_args.keys())
        if unsatisfied_args:
            # Expected match info that doesn't exist
            dbglog(f'dispatch {mname}: unsatisfied args: {unsatified_ars}')
            raise HTTPBadRequest(
                body=json.dumps({
                    'error': f'unsatisfied args: {unsatified_ars}'
                }).encode('utf-8'))

        try:
            return await method(**{arg_name: available_args[arg_name] for arg_name in wanted_args})

        except Exception as e:
            dbglog(f'dispatch {mname}: exception {e}')
            raise HTTPBadRequest(
                body=json.dumps({
                    'exception': f'{e}'
                }).encode('utf-8'))


class CollectionEndpoint(RestEndpoint):
    def __init__(self, resource):
        super().__init__()
        self.resource = resource

    async def get(self) -> Response:
        data = []

        for instance in self.resource.collection.values():
            data.append(self.resource.render(instance))
        data = self.resource.encode(data)

        return Response(
            status=200,
            body=self.resource.encode({
                'notes': [
                    {
                        'title': note.title,
                        'description': note.description,
                        'created_at': note.created_at,
                        'created_by': note.created_by,
                        'priority': note.priority
                    }
                    for note in Notes.objects
                ]
            }),
            content_type='application/json'
        )

    async def post(self, request):
        data = await request.json()

        mongo_note = Notes(title=data['title'],
                        description=data['description'],
                        created_at=data['created_at'],
                        created_by=data['created_by'],
                        priority=data['priority']).save()

        return Response(
            status=201,
            body=self.resource.encode({
                'notes': [
                    {
                        'title': note.title,
                        'description': note.description,
                        'created_at': note.created_at,
                        'created_by': note.created_by,
                        'priority': note.priority
                    }
                    for note in Notes.objects
                ]
            }),
            content_type='application/json'
        )


class RestResource:
    def __init__(self, notes, factory, collection, properties, id_field):
        self.notes = notes
        self.factory = factory
        self.collection = collection
        self.properties = properties
        self.id_field = id_field

        self.collection_endpoint = CollectionEndpoint(self)

    def register(self, router: UrlDispatcher):
        router.add_route('*', '/{notes}'.format(notes=self.notes), self.collection_endpoint.dispatch)

    def render(self, instance):
        return OrderedDict((notes, getattr(instance, notes)) for notes in self.properties)

    @staticmethod
    def encode(data):
        return json.dumps(data, indent=4).encode('utf-8')

    def render_and_encode(self, instance):
        return self.encode(self.render(instance))
