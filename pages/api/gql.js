import nc from 'next-connect';
import Gql from '../../scripts/server/gql';
import auth from '../../scripts/server/authenticate';

const app = nc();
app.post(async (req, res) => {
  auth(req, res, async () => {
    const gql = new Gql(req.cookies['connect.sid'])
    let rs = await gql.raw(req.body);
    res.json(rs)
  })
});

export default app;
