const amf = require('./amf');

module.exports = () => (req, res, next) => {
    if (req.header('accept') === 'application/x-amf') {
        const oldSend = res.send;
        res.send = function (data) {
            const body = arguments[0];
            const serializer = new amf.Serializer();
            serializer.writeObject(body);
            res.type('application/x-amf');
            res.send = oldSend;
            oldSend.apply(res, [Buffer.from(serializer.writer.data)]);
        };
    }
    if (req.header('content-type') === 'application/x-amf') {
        const data = [];
        req.on('data', chunk => {
            data.push(chunk);
        });
        req.on('end', function () {
            try {
              req.body = new amf.Deserializer(new Uint8Array(Buffer.concat(data))).readObject();
              next();
            } catch (err) {
              console.error(err);
              res.send(400);
            }
        });
    } else {
        next();
    }
};
