## Permission Enumeration

Supported permissions within the UES console are defined by the "Permission" enumeration provided in libs/data/shared/src/permissions/types.ts. New permissions must be added to this enumeration.

## Permission Override

Browser local storage permission override settings are supported using the enum string value as part of a JSON payload for the storage key 'UES_permissionOverrides'. For example, use the following permission key and value to set the permission to update MTD policy is not granted, which will affect how the MTD policy will be rendered with the console, independent of the permission value from the JWT token in the backend service:

| Key                   | value |
| --------------------- | ----- |
| Ues:Mtd:Policy:Update | false |

### Feature Flag

The feature flag 'ues.permission.checks.enabled' must be enabled for permission check to happen as this is used to control the RBAC checks for Chronos.

## Manual Testing - Chrome

The following show example usage of how set the permission override in Chrome.

Example usage

    localStorage['ues.permission.checks.enabled']=true  (Reload console)
    window.postMessage({key: 'UES_permissionOverrides', value: {'Ues:Ecs:ActivationProfile:Read':false,'Ues:Ecs:ActivationProfile:Create':true,'Ues:Ecs:ActivationProfile:Delete':true}}, "*")

The permission can also be set under Chrome -> Dev Tools -> Application tab -> Storage -> localStorage using key 'UES_permissionOverrides' and a JSON string. The UES console does not need to be refreshed when overriding the permissions using this approach or the postMessage approach.

In Chrome browser, one may also set the permission using the developer Console like this, but this require a page reload (reload is not needed in FireFox). Please pay attention to the double quote.

    localStorage.setItem('UES_permissionOverrides', JSON.stringify({"Ues:Ecs:ActivationProfile:Read":false,"Ues:Ecs:ActivationProfile:Create":false,"Ues:Ecs:ActivationProfile:Delete":true}))

## CYPRESS TESTING

When doing Cypress testing, an API called "overridePermissions" MUST be used as it hides some issue with Electron/Firefox vs Chrome, and any fixes re-implementation will ensure existing Cypress tests are not touched. The flow of Cypress test should be something like tihs

1. load the page in before() method. Example
   before(() => {
   window.localStorage.clear()
   setLocalStorageState(window)
   I.loadI18nNamespaces('platform/common').then(() => {
   I.visit('/user-policies#/list/activation')
   })
   })

2. In each integration test "it()" method, call I.overridePermission to set the permissions. Example
   const overridePermissionsObj = {}
   overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_READ] = true
   overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_CREATE] = true
   overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_DELETE] = true

3. Verify the page according to the permissions such as that the page is loaded and that the 'Permission denied' localized string is not there.

4. Call I.overridePermissions to set some permission. Example:

   - overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_CREATE] = false

5. Verify page that 'Permission denied' localized string is there.

If the page you are testing have links, do not navigate to those links, but mainly verify that the link exist is clickable. It is not the purpose of the RBAC test to test other pages.

In the same "spec.ts" file, it is possible to add multiple 'suite' using the "describe" method. It is recommended that each "describe" method test one page with different permission permutation. For example, one "describe" would test the 'copy' URL page as in the case the user may have gotten the URL directly and entered in to the browser. Another "describe" could test the "edit" profile URL. And yet another "describe" can test the "add" profile URL.

Example Cypress RBAC

    describe('Enrollment policy list - RBAC', () => {
        let noAccessString
        let noAccessMessageString

        before(() => {
            window.localStorage.clear()
            // turn on necessary features
            setLocalStorageState(window)
            I.loadI18nNamespaces('platform/common').then(() => {
                // load messages
                noAccessString = t('noPermission')
                noAccessMessageString = t('noAccessMessage')

                // load page once
                I.visit('#/list/activation')
            })
        })
        it('testing list read permission granted/denied', () => {
            const overridePermissionsObj = {}
            overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_CREATE] = true
            overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_DELETE] = true

            // set read permission to true
            overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_READ] = true
            // need to copy the permission object since the Cypress command runs as a callback and if the value is changed later, then we will have wrong execution
            I.overridePermissions({ ...overridePermissionsObj })

            // verify that Permission denied string is not there
            I.findByText(noAccessMessageString).should('not.exist')

            // here verify that other UX content specific to this page is here
            verifyThisPageContentExist()

            // set read permission to false
            overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_READ] = false
            // need to copy the permission object since the Cypress command runs as a callback and if the value is changed later, then we will have wrong execution
            I.overridePermissions({ ...overridePermissionsObj })

            // verify that Permission denied localized string is there
            I.findByText(noAccessMessageString).should('exist')

            // here verify that other UX content specific to this page is here
            verifyThisPageContentNotExist()
        })
    })

For more information on RBAC console behaviour, see https://wikis.rim.net/pages/viewpage.action?spaceKey=UESUC&title=RBAC+for+UES+Console and https://ues-console-sites.sw.rim.net/s3/console/sites/master/docs/behaviours/index.html?path=/story/rbac-roles--custom
