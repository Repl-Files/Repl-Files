import nc from 'next-connect';
import Gql from '../../scripts/gql';
import auth from '../../scripts/authenticate';

const app = nc();
app.post(async (req, res) => {
  auth(req, res, async () => {
    const gql = new Gql(req.cookies['connect.sid'])
    let rs = await gql.raw(req.body);
    res.json(rs)
  })
});

export default app;
