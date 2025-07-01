// eslint-disable-next-line @softarc/sheriff/dependency-rule, @softarc/sheriff/encapsulation
import { sameTag, SheriffConfig } from '@softarc/sheriff-core';

const domainApiTag = ({ from, to }) => {
  const getDomainTagDetails = (tag: string) => {
    const [, domainName] = tag.split(':');
    const [source,, target] = domainName.split('-');
    return { source, target };
  }

  const checkNotUndefined = (from: string, to: string) => !!(from && to && from === to);

  return checkNotUndefined(
    getDomainTagDetails(from).source,
    getDomainTagDetails(to).target
  ) || checkNotUndefined(
    getDomainTagDetails(from).source,
    getDomainTagDetails(to).source
  );
}

/**
  * Minimal configuration for Sheriff
  * Assigns the 'noTag' tag to all modules and
  * allows all modules to depend on each other.
  */

export const config: SheriffConfig = {
  enableBarrelLess: true,
  modules: {
    apps: {
      '<domain>': ['domain:<domain>', 'type:app']
    },
    libs: {
      domain: {
        '<domain>': {
          'src': ['domain:<domain>', 'type:lib'],
          'src/lib': {
            'api-<target>': ['domain:<domain>-api-<target>', 'type:api'],
            '<type>': ({ type }) => ['domain:<domain>', `type:${ type.split('-')[0] }`],
          },
        }
      },
      shared: {
        '<domain>': {
          'src': ['domain:shared', 'type:lib'],
          'src/lib/<type>': ({ type }) => ['domain:shared', `type:${ type.split('-')[0] }`],
        }
      },
    }
  }, // apply tags to your modules
  depRules: {
    // root is a virtual module, which contains all files not being part
    // of any module, e.g. application shell, main.ts, etc.
    // 'root': 'noTag',
    // 'noTag': ['noTag', 'root'],
    'domain:*': [sameTag, domainApiTag, 'domain:shared'],
    'domain:shell': ['domain:*'],
    'type:*': ['type:lib'],
    'type:lib': ['type:api', 'type:route', 'type:feature', 'type:ui', 'type:logic', 'type:util'],
    'type:route': ['type:feature', 'type:logic'],
    'type:api': ['type:ui', 'type:logic', 'type:util'],
    'type:feature': ['type:api', 'type:ui', 'type:logic', 'type:util'],
    'type:ui': ['type:logic', 'type:util'],
    'type:logic': ['type:util']
    // add your dependency rules here
  },
};


/**
 * npx sheriff list .\apps\shell\src\main.ts
 *
 * This project contains 23 modules:
 *
 * . (root)
 * ├── apps\shell (domain:shell, type:app)
 * ├── apps\shell-e2e (domain:shell-e2e, type:app)
 * ├── libs\domain\boarding\src\lib\feature-departure (domain:boarding, type:feature)
 * ├── libs\domain\boarding\src\lib\route-boarding (domain:boarding, type:route)
 * ├── libs\domain\booking\src\lib\api-boarding (domain:booking-api-boarding, type:api)
 * ├── libs\domain\booking\src\lib\feature-flight (domain:booking, type:feature)
 * ├── libs\domain\booking\src\lib\logic-flight (domain:booking, type:logic)
 * ├── libs\domain\booking\src\lib\route-booking (domain:booking, type:route)
 * ├── libs\domain\booking\src\lib\ui-flight (domain:booking, type:ui)
 * ├── libs\domain\checkin\src\lib\feature-passenger (domain:checkin, type:feature)
 * ├── libs\domain\checkin\src\lib\logic-passenger (domain:checkin, type:logic)
 * ├── libs\domain\checkin\src\lib\route-checkin (domain:checkin, type:route)
 * ├── libs\shared\core\src\lib\feature-core (domain:shared, type:feature)
 * ├── libs\shared\core\src\lib\ui-core (domain:shared, type:ui)
 * ├── libs\shared\logger\src\lib\logic-cd-visualizer (domain:shared, type:logic)
 * ├── libs\shared\state\src\lib\logic-router-feature (domain:shared, type:logic)
 * ├── libs\domain\boarding\src (domain:boarding, type:lib)
 * ├── libs\domain\booking\src (domain:booking, type:lib)
 * ├── libs\domain\checkin\src (domain:checkin, type:lib)
 * ├── libs\domain\checkin\src\lib\util-validation (domain:checkin, type:util)
 * ├── libs\shared\core\src (domain:shared, type:lib)
 * ├── libs\shared\logger\src (domain:shared, type:lib)
 * └── libs\shared\state\src (domain:shared, type:lib)
 *
 */

/**
 * npx sheriff verify .\apps\shell\src\main.ts
 *
 * Verification Report
 *
 * No issues found. Well done!
 */

/**
 * npx nx lint shell
 *
 * > nx run shell:lint
 * Linting "shell"...
 * ✔ All files pass linting
 */

/**
 * npx nx lint booking
 *
 * > nx run booking:lint
 * Linting "booking"...
 * ✔ All files pass linting
 */
