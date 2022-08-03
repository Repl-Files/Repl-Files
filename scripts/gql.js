export default class Gql {
  constructor(sid) {
    this.sid = sid;
  }
  async query(q) {
    return await fetch("https://replit.com/graphql", {
      method: "POST",
      headers: {
        'X-Requested-With': 'replit',
        'Origin': 'https://replit.com',
        'Accept': 'application/json',
        'Referrer': "https://replit.com",
        'Content-Type': 'application/json',
        'Connection': 'keep-alive',
        'Host': "replit.com",
        "x-requested-with": "XMLHttpRequest",
        "User-Agent": "Mozilla/5.0",
        "cookie": "connect.sid=" + this.sid
      },
      body: JSON.stringify({
        query: q
      })
    }).then(r => r.json())
  }
  async raw(body){
    return await fetch("https://replit.com/graphql", {
      method: "POST",
      headers: {
        'X-Requested-With': 'replit',
        'Origin': 'https://replit.com',
        'Accept': 'application/json',
        'Referrer': "https://replit.com",
        'Content-Type': 'application/json',
        'Connection': 'keep-alive',
        'Host': "replit.com",
        "x-requested-with": "XMLHttpRequest",
        "User-Agent": "Mozilla/5.0",
        "cookie": "connect.sid=" + this.sid
      },
      body: JSON.stringify(body)
    }).then(r => r.json())
  }
  async allForks(url){
    let forks = [];
    let __root = await this.raw({
      query: `query repl($url: String!){ repl(url: $url){ ...on Repl { publicForkCount publicForks(count: 10000){ items { id url lastPublishedAt templateCategory } } } } }`,
      variables: { url }
    });
    forks = [...forks, ...(__root.data.repl.publicForks.items)];
    if(__root){
      while(forks.length < __root.data.repl.publicForkCount){
        let dt = await this.raw({
          query: `query ($url: String!){ repl(url: $url){ ...on Repl { publicForkCount publicForks(count: 10000, after: "${(forks.at(-1)).id}"){ items { id url lastPublishedAt templateCategory } } } } }`,
          variables: { url }
        });
        forks = [...forks, ...(dt.data.repl.publicForks.items)];
      }
    }
    return forks;
  }
}