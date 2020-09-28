const handle = resolvers => event => {
  const typeHandler = resolvers[event.typeName];
  const resolver = !!typeHandler ? typeHandler[event.fieldName] : null
  const promise = new Promise((resolve, reject) => 
    !!typeHandler && !!resolver ? (
      resolver(event)
        .then(resolve)
        .catch(err => 
          console.log("ERROR:", err.message || err) ||
          reject(Error(!!err.message ? err.message : JSON.stringify(err)))  
        )
    ) : (
      reject(Error("Resolver not found"))
    )
  )

  return promise;
}

export {
  handle
}