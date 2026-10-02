posicao_inicial=





















def enviar_mensagem(nome, numero):
  print(f'Enviando mensagem abaixo para {nome} no número {numero}...')
  print(f'''
    Ficamos muito felizes em tê-lo conosco!
    Esperamos que você aproveite a experiência {nome}!
  ''')
  print('Mensagem enviada com sucesso!')

convidados = [
  ['Cassio', '92234567', True], 
  ['Maria', '92334885', False], 
  ['João', '92437744', True]
]

for convidado in convidados:
  if convidado[2] == False:  # Verifica se o convidado confirmou presença
    continue;
  
  print (f'Nome: {convidado[0]}, Telefone: {convidado[1]}')
  enviar_mensagem(convidado[0], convidado[1])