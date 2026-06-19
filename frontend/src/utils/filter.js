import filter from 'leo-profanity'

filter.loadDictionary('ru')

filter.add([
  'член', 'члены', 'членов',
  'елда', 'елду', 'елдой',
  'писька', 'письку', 'писькой',
  'вагина', 'вагину', 'вагиной',
  'пенис', 'пениса', 'пенисом',
])

export const filterText = (text) => {
  if (!text) return text
  return filter.clean(text)
}

export default filterText