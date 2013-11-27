#!/bib/bash

( cd lib/common/ ; npm install )
( cd lib/services/computeManagement/ ; npm link ../../common/ ; npm install )
( cd lib/services/management/ ; npm link ../../common/ ; npm install )
( cd lib/services/networkManagement/ ; npm link ../../common/ ; npm install )
( cd lib/services/serviceBusManagement/ ; npm link ../../common/ ; npm install )
( cd lib/services/sqlManagement/ ; npm link ../../common/ ; npm install )
( cd lib/services/storageManagement/ ; npm link ../../common/ ; npm install )
( cd lib/services/storeManagement/ ; npm link ../../common/ ; npm install )
( cd lib/services/subscriptionManagement/ ; npm link ../../common/ ; npm install )
( cd lib/services/webSiteManagement/ ; npm link ../../common/ ; npm install )
npm link lib/common/
npm link lib/services/computeManagement/
npm link lib/services/management/
npm link lib/services/networkManagement/
npm link lib/services/serviceBusManagement/
npm link lib/services/sqlManagement/
npm link lib/services/storageManagement/
npm link lib/services/storeManagement/
npm link lib/services/subscriptionManagement/
npm link lib/services/webSiteManagement/