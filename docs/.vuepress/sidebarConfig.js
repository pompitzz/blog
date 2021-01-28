module.exports = {
    '/': [
        { title: 'Groovy', children: ['/Groovy/spock-summary.md'] },
        {
            title: 'Java',
            children: ['/Java/awsEc2InstallJDK11.md', '/Java/javaOverloadingParameter.md', '/Java/threadPoolExecutor.md', '/Java/whyCantCreateGenericsArray.md'],
        }, {
            title: 'Spring',
            children: ['/Spring/DI_IOC.md', '/Spring/Scheduler.md', '/Spring/SpringBoot_Custom_Config_Properties.md'],
        }, {
            title: 'Vue',
            children: [{
                title: 'VuePress',
                children: ['/Vue/VuePress/ch1.md', '/Vue/VuePress/ch2.md'],
            }, '/Vue/vuexModuleAutoRegister.md'],
        }],
};
