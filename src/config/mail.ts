interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'sandro.almeida.silva17@gmail.com',
      name: 'Sandro Almeida',
    },
  },
} as IMailConfig;
