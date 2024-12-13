module.exports = {
    name: 'check',
    description: '봇 작동 상태를 확인합니다.',
    execute: async (message) => {
        message.reply('봇이 정상 작동 중입니다.');
    },
};
