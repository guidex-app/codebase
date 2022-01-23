export interface Topic {
    title: { form: string, name: string },
    type: 'seopage' | 'seotext' | 'topicpage' | 'topictext' | 'notlisted' | 'quickfilter',
    description: string,
    partitions?: string[],
    filter: string[],
    state: 'inEdit' | 'online',
  }

export interface TopicThumbnail {
    title: { form: string, name: string },
    size?: 'small' | 'normal',
  }
