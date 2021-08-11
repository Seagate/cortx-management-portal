#!/bin/env python3

# Copyright (c) 2021 Seagate Technology LLC and/or its Affiliates
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

import sys
import errno
import argparse
import inspect
import traceback
import os
import pathlib


class Cmd:
    """
    Setup Command
    """
    _index = "setup"

    def __init__(self, args: dict):
        """
        Initializing Cmd
        """
        self._url = args.config
        self._args = args.args

    @property
    def args(self) -> str:
        return self._args

    @property
    def url(self) -> str:
        return self._url

    @staticmethod
    def usage(prog: str):
        """
        Print usage instructions
        """
        sys.stderr.write(
            f"usage: {prog} [-h] <cmd> --config <url> <args>...\n"
            f"where:\n"
            f"cmd   post_install, prepare, config, init, reset, cleanup, test, pre_upgrade, post_upgrade\n"
            f"url   Config URL\n")

    @staticmethod
    def get_command(desc: str, argv: dict):
        """
        Return the Command after parsing the command line
        """
        parser = argparse.ArgumentParser(desc)

        subparsers = parser.add_subparsers()
        cmds = inspect.getmembers(sys.modules[__name__])
        cmds = [(x, y) for x, y in cmds
            if x.endswith("Cmd") and x != "Cmd"]
        for name, cmd in cmds:
            cmd.add_args(subparsers, cmd, name)
        args = parser.parse_args(argv)
        return args.command(args)

    @staticmethod
    def _add_extended_args(parser):
        """
        Override this method to add extended args
        """
        return 0

    @staticmethod
    def add_args(parser: str, cls: str, name: str):
        """
        Add Command args for parsing
        """
        sub_parser = parser.add_parser(cls.name, help='setup %s' % name)
        sub_parser.add_argument('--config', help='Conf Store URL', type=str)
        cls._add_extended_args(sub_parser)
        sub_parser.add_argument('args', nargs='*', default=[], help='args')
        sub_parser.set_defaults(command=cls)


class PostInstallCmd(Cmd):
    """
    PostInstall Setup Cmd
    """
    name = "post_install"

    def __init__(self, args: dict):
        """
        Initializing PostInstallCmd
        """
        super().__init__(args)
        self.csm_web = CSMWeb(args.config, command_name=self.name)

    def process(self):
        rc = self.csm_web.post_install()
        return rc


class PrepareCmd(Cmd):
    """
    Prepare Setup Cmd
    """
    name = "prepare"

    def __init__(self, args: dict):
        """
        Initializing PrepareCmd
        """
        super().__init__(args)
        self.csm_web = CSMWeb(args.config, command_name=self.name)

    def process(self):
        # TODO: Add actions here
        rc = self.csm_web.prepare()
        return rc


class ConfigCmd(Cmd):
    """
    Setup Config Cmd
    """
    name = "config"

    def __init__(self, args):
        """
        Initializing ConfigCmd
        """
        super().__init__(args)
        self.csm_web = CSMWeb(args.config, command_name=self.name)

    def process(self):
        # TODO: Add actions here
        rc = self.csm_web.config()
        return rc


class InitCmd(Cmd):
    """
    Init Setup Cmd
    """
    name = "init"

    def __init__(self, args):
        """
        Initializing InitCmd
        """
        super().__init__(args)
        self.csm_web = CSMWeb(args.config, command_name=self.name)

    def process(self):
        # TODO: Add actions here
        rc = self.csm_web.init()
        return rc


class TestCmd(Cmd):
    """
    Test Setup Cmd
    """
    name = "test"

    @staticmethod
    def _add_extended_args(parser):
        parser.add_argument('--plan', help='Test Plan', type=str)

    def __init__(self, args):
        super().__init__(args)
        self.csm_web = CSMWeb(args.config, command_name=self.name)
        self.test_plan = args.plan

    def process(self):
        # TODO: Add actions here
        rc = self.csm_web.test(self.test_plan)
        return rc


class ResetCmd(Cmd):
    """
    Reset Setup Cmd
    """
    name = "reset"

    def __init__(self, args):
        super().__init__(args)
        self.csm_web = CSMWeb(args.config, command_name=self.name)

    def process(self):
        # TODO: Add actions here
        rc = self.csm_web.reset()
        return rc

class CleanupCmd(Cmd):
    """
    cleanup Setup Cmd
    """
    name = "cleanup"

    def __init__(self, args):
        super().__init__(args)
        self.csm_web = CSMWeb(args.config, command_name=self.name, pre_factory=args.pre_factory)

    @staticmethod
    def _add_extended_args(parser):
        parser.add_argument('--pre-factory', help='Perform pre-factory cleanup', \
                dest='pre_factory', action='store_true')

    def process(self):
        # TODO: Add actions here
        rc = self.csm_web.cleanup()
        return rc
class PreUpgradeCmd(Cmd):
    """
    Pre upgrade Setup Cmd
    """
    name = "pre_upgrade"

    def __init__(self, args):
        super().__init__(args)
        self.csm_web = CSMWeb(args.config, command_name=self.name)

    def process(self):
        # TODO: Add actions here
        rc = self.csm_web.pre_upgrade()
        return rc

class PostUpgradeCmd(Cmd):
    """
    Post upgrade Setup Cmd
    """
    name = "post_upgrade"

    def __init__(self, args):
        super().__init__(args)
        self.csm_web = CSMWeb(args.config, command_name=self.name)

    def process(self):
        rc = self.csm_web.post_upgrade()
        return rc

def main(argv: dict):
    try:
        desc = "CORTX CSMWeb Setup command"
        command = Cmd.get_command(desc, argv[1:])
        rc = command.process()
        if rc != 0:
            raise ValueError(f"Failed to run {argv[1]}")
        sys.stdout.write(":PASS")
        return 0
    except CSMWebSetupError as e:
        sys.stderr.write("%s\n" % str(e))
        return e.rc()

    except Exception as e:
        sys.stderr.write("error: %s\n\n" % str(e))
        sys.stderr.write("%s\n" % traceback.format_exc())
        return errno.EINVAL


if __name__ == '__main__':
    sys.path.append(os.path.join(os.path.dirname(pathlib.Path(__file__)), '..', '..', '..', '..'))
    sys.path.append(os.path.join(os.path.dirname(pathlib.Path(os.path.realpath(__file__))), '..', '..', '..'))
    #from csm_web import CSMWeb
    #from csm_web import CSMWebSetupError
    from csm.web.conf.csm_web import CSMWeb
    from csm.web.conf.csm_web import CSMWebSetupError
    sys.exit(main(sys.argv))