# CORTX-CSM: CORTX Management web and CLI interface.
# Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published
# by the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <https://www.gnu.org/licenses/>.
# For any questions about this software or licensing,
# please email opensource@seagate.com or cortx-questions@seagate.com.

import os
import json


class Doc:
    _type = dict

    def __init__(self, source):
        """Initializing Doc."""
        self._source = source

    def __str__(self):
        """Returning source in String format."""
        return str(self._source)

    def load(self):
        """Loads data from file of given format."""
        if not os.path.exists(self._source):
            return {}
        try:
            return self._load()
        except Exception as e:
            raise Exception('Unable to read file %s. %s' % (self._source, e))

    def dump(self, data):
        """Dump the anifest file to desired file or to the source."""
        dir_path = os.path.dirname(self._source)
        if len(dir_path) > 0 and not os.path.exists(dir_path):
            os.makedirs(dir_path)
        self._dump(data)

class Json(Doc):
    """Represents a JSON doc."""
    def __init__(self, file_path):
        """Initializing Json."""
        Doc.__init__(self, file_path)

    def _load(self):
        with open(self._source, 'r') as f:
            return json.load(f)

    def _dump(self, data):
        with open(self._source, 'w') as f:
            json.dump(data, f, indent=2)


class Dict(Doc):
    """Represents Dictionary Without file."""
    def __init__(self, data={}):
        """Initializing Dict."""
        Doc.__init__(self, data)

    def load(self):
        return self._source

    def dump(self, data):
        self._source = data

class Text(Doc):
    """Represents a TEXT doc."""
    def __init__(self, file_path):
        """Initializing Text."""
        Doc.__init__(self, file_path)

    def _load(self):
        """Loads data from text file."""
        with open(self._source, 'r') as f:
            return f.read()

    def _dump(self, data):
        """Dump the data to desired file or to the source."""
        with open(self._source, 'w') as f:
            f.write(data)

class JsonMessage(Json):
    """Represents JsonMessage."""
    def __init__(self, json_str):
        """
        Represents the Json Without FIle
        :param json_str: Json String to be processed :type: str
        """
        Json.__init__(self, json_str)

    def load(self):
        """
        Load the json to python interpretable Dictionary Object
        :return: :type: Dict
        """
        return json.loads(self._source)

    def dump(self, data):
        """
        Set's the data _source after converting to json
        :param data: :type: Dict
        :return:
        """
        self._source = json.dumps(data)
        return self._source

class Payload:
    """implements a Payload in specified format."""
    def __init__(self, doc):
        """Initalizing Payload."""
        self._dirty = False
        self._doc = doc
        self.load()

    def load(self):
        if self._dirty:
            raise Exception('%s not synced to disk' % self._doc)
        self._data = self._doc.load()
        return self._data

    def dump(self):
        """Dump the anifest file to desired file or to the source."""
        self._doc.dump(self._data)
        self._dirty = False

    def _get(self, key, data):
        """Obtain value for the given key."""
        k = key.split('.', 1)
        if k[0] not in data.keys(): return None
        return self._get(k[1], data[k[0]]) if len(k) > 1 else data[k[0]]

    def get(self, key):
        if self._data is None:
            raise Exception('Configuration %s not initialized' % self._doc)
        return self._get(key, self._data)

    def _set(self, key, val, data):
        k = key.split('.', 1)
        if len(k) == 1:
            data[k[0]] = val
            return
        if k[0] not in data.keys() or type(data[k[0]]) != self._doc._type:
            data[k[0]] = {}
        self._set(k[1], val, data[k[0]])

    def set(self, key, val):
        """Sets the value into the DB for the given key."""
        self._set(key, val, self._data)
        self._dirty = True

    def pop(self, key, *defaultvalue):
        k = key.split('.', 1)
        if len(k) == 1:
            dirty = k[0] in self._data
            value = self._data.pop(k[0], *defaultvalue)
        else:
            dirty = k[1] in self._data[k[0]]
            value = self._data[k[0]].pop(k[1], *defaultvalue)
            if dirty and not bool(self._data[k[0]]):
                self._data.pop(k, None)
        self._dirty = dirty
        return value

    def convert(self, map_dict, payload):
        """
        Converts 1 Schema to 2nd Schema depending on mapping dictionary.
        :param map_dict: mapping dictionary :type:Dict
        :param payload: Payload Class Object with desired Source.
        :return: :type: Dict
        Mapping file example -
        key <input schema> : value <output schema>
        """
        for key in map_dict.keys():
            val = self.get(key)
            payload.set(map_dict[key], val)
        return payload

    def data(self):
        return self._data
