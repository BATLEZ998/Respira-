"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Heart, 
  DollarSign, 
  Trophy, 
  Calendar, 
  Zap, 
  Shield, 
  Users, 
  BookOpen,
  AlertTriangle,
  Wind,
  Clock,
  Target,
  Star,
  Gift,
  TrendingUp,
  Smile,
  MessageCircle
} from 'lucide-react'

interface UserData {
  age: number
  gender: string
  smokingYears: number
  cigarettesPerDay: number
  packPrice: number
  timeBetweenCigarettes: number
  quitDate: Date | null
}

interface Milestone {
  hours: number
  title: string
  description: string
  icon: any
  achieved: boolean
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  unlocked: boolean
  progress: number
  target: number
}

export default function QuitSmokingApp() {
  const [currentStep, setCurrentStep] = useState<'onboarding' | 'dashboard'>('onboarding')
  const [userData, setUserData] = useState<UserData>({
    age: 0,
    gender: '',
    smokingYears: 0,
    cigarettesPerDay: 0,
    packPrice: 0,
    timeBetweenCigarettes: 0,
    quitDate: null
  })
  
  const [moodEntry, setMoodEntry] = useState('')
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [breathingExercise, setBreathingExercise] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [breathingCount, setBreathingCount] = useState(4)

  // Carregar dados do localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('quitSmokingData')
    if (savedData) {
      const parsed = JSON.parse(savedData)
      setUserData({
        ...parsed,
        quitDate: parsed.quitDate ? new Date(parsed.quitDate) : null
      })
      if (parsed.quitDate) {
        setCurrentStep('dashboard')
      }
    }
  }, [])

  // Salvar dados no localStorage
  const saveUserData = (data: UserData) => {
    setUserData(data)
    localStorage.setItem('quitSmokingData', JSON.stringify(data))
  }

  // Calcular tempo sem fumar
  const getTimeSinceQuit = () => {
    if (!userData.quitDate) return { days: 0, hours: 0, minutes: 0 }
    
    const now = new Date()
    const diff = now.getTime() - userData.quitDate.getTime()
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return { days, hours, minutes }
  }

  // Calcular economia
  const calculateSavings = () => {
    if (!userData.quitDate) return { total: 0, cigarettesAvoided: 0 }
    
    const timeSince = getTimeSinceQuit()
    const totalHours = timeSince.days * 24 + timeSince.hours + timeSince.minutes / 60
    
    const cigarettesAvoided = Math.floor((totalHours / 24) * userData.cigarettesPerDay)
    const packsAvoided = cigarettesAvoided / 20
    const total = packsAvoided * userData.packPrice
    
    return { total, cigarettesAvoided }
  }

  // Marcos de progresso
  const milestones: Milestone[] = [
    { hours: 1, title: "1 Hora", description: "Frequência cardíaca e pressão começam a normalizar", icon: Heart, achieved: false },
    { hours: 12, title: "12 Horas", description: "Níveis de monóxido de carbono no sangue voltam ao normal", icon: Wind, achieved: false },
    { hours: 24, title: "1 Dia", description: "Risco de ataque cardíaco começa a diminuir", icon: Shield, achieved: false },
    { hours: 48, title: "2 Dias", description: "Terminações nervosas começam a se regenerar", icon: Zap, achieved: false },
    { hours: 72, title: "3 Dias", description: "Respiração melhora, capacidade pulmonar aumenta", icon: Wind, achieved: false },
    { hours: 168, title: "1 Semana", description: "Risco de ataque cardíaco reduz significativamente", icon: Heart, achieved: false },
    { hours: 720, title: "1 Mês", description: "Circulação melhora, função pulmonar aumenta 30%", icon: TrendingUp, achieved: false },
    { hours: 2160, title: "3 Meses", description: "Tosse e falta de ar diminuem drasticamente", icon: Wind, achieved: false },
    { hours: 8760, title: "1 Ano", description: "Risco de doença cardíaca reduz pela metade", icon: Heart, achieved: false }
  ]

  // Conquistas/Achievements
  const achievements: Achievement[] = [
    { id: 'first_day', title: 'Primeiro Passo', description: 'Completou 24 horas sem fumar', icon: Star, unlocked: false, progress: 0, target: 24 },
    { id: 'week_warrior', title: 'Guerreiro da Semana', description: 'Uma semana completa sem fumar', icon: Trophy, unlocked: false, progress: 0, target: 168 },
    { id: 'money_saver', title: 'Poupador', description: 'Economizou R$ 100', icon: DollarSign, unlocked: false, progress: 0, target: 100 },
    { id: 'health_hero', title: 'Herói da Saúde', description: 'Evitou 200 cigarros', icon: Heart, unlocked: false, progress: 0, target: 200 },
    { id: 'month_master', title: 'Mestre do Mês', description: 'Um mês completo sem fumar', icon: Calendar, unlocked: false, progress: 0, target: 720 }
  ]

  // Atualizar marcos e conquistas
  const updateProgress = () => {
    if (!userData.quitDate) return { milestones, achievements }
    
    const timeSince = getTimeSinceQuit()
    const totalHours = timeSince.days * 24 + timeSince.hours + timeSince.minutes / 60
    const savings = calculateSavings()
    
    const updatedMilestones = milestones.map(milestone => ({
      ...milestone,
      achieved: totalHours >= milestone.hours
    }))
    
    const updatedAchievements = achievements.map(achievement => {
      let progress = 0
      let unlocked = false
      
      switch (achievement.id) {
        case 'first_day':
        case 'week_warrior':
        case 'month_master':
          progress = Math.min(totalHours, achievement.target)
          unlocked = totalHours >= achievement.target
          break
        case 'money_saver':
          progress = Math.min(savings.total, achievement.target)
          unlocked = savings.total >= achievement.target
          break
        case 'health_hero':
          progress = Math.min(savings.cigarettesAvoided, achievement.target)
          unlocked = savings.cigarettesAvoided >= achievement.target
          break
      }
      
      return { ...achievement, progress, unlocked }
    })
    
    return { milestones: updatedMilestones, achievements: updatedAchievements }
  }

  const { milestones: currentMilestones, achievements: currentAchievements } = updateProgress()

  // Exercício de respiração
  useEffect(() => {
    if (!breathingExercise) return
    
    const interval = setInterval(() => {
      setBreathingCount(prev => {
        if (prev <= 1) {
          if (breathingPhase === 'inhale') {
            setBreathingPhase('hold')
            return 4
          } else if (breathingPhase === 'hold') {
            setBreathingPhase('exhale')
            return 6
          } else {
            setBreathingPhase('inhale')
            return 4
          }
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [breathingExercise, breathingPhase])

  // Iniciar jornada
  const startQuitJourney = () => {
    const newUserData = {
      ...userData,
      quitDate: new Date()
    }
    saveUserData(newUserData)
    setCurrentStep('dashboard')
  }

  // Sugestões de compras baseadas na economia
  const getSuggestions = (amount: number) => {
    const suggestions = [
      { item: 'Jantar romântico', price: 150 },
      { item: 'Tênis novo', price: 300 },
      { item: 'Curso online', price: 200 },
      { item: 'Viagem de fim de semana', price: 500 },
      { item: 'Smartphone novo', price: 1200 },
      { item: 'Academia (3 meses)', price: 180 },
      { item: 'Livros', price: 100 },
      { item: 'Investimento em ações', price: amount }
    ]
    
    return suggestions.filter(s => s.price <= amount).slice(0, 3)
  }

  if (currentStep === 'onboarding') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pare de Fumar</h1>
            <p className="text-gray-600">Sua jornada para uma vida mais saudável começa aqui</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vamos conhecer você melhor</CardTitle>
              <CardDescription>
                Essas informações nos ajudarão a personalizar sua experiência
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    value={userData.age || ''}
                    onChange={(e) => setUserData({...userData, age: parseInt(e.target.value) || 0})}
                    placeholder="Ex: 30"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gênero</Label>
                  <Select value={userData.gender} onValueChange={(value) => setUserData({...userData, gender: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                      <SelectItem value="prefiro-nao-dizer">Prefiro não dizer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smokingYears">Há quantos anos fuma?</Label>
                  <Input
                    id="smokingYears"
                    type="number"
                    value={userData.smokingYears || ''}
                    onChange={(e) => setUserData({...userData, smokingYears: parseInt(e.target.value) || 0})}
                    placeholder="Ex: 10"
                  />
                </div>
                <div>
                  <Label htmlFor="cigarettesPerDay">Cigarros por dia</Label>
                  <Input
                    id="cigarettesPerDay"
                    type="number"
                    value={userData.cigarettesPerDay || ''}
                    onChange={(e) => setUserData({...userData, cigarettesPerDay: parseInt(e.target.value) || 0})}
                    placeholder="Ex: 20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="packPrice">Preço do maço (R$)</Label>
                  <Input
                    id="packPrice"
                    type="number"
                    step="0.01"
                    value={userData.packPrice || ''}
                    onChange={(e) => setUserData({...userData, packPrice: parseFloat(e.target.value) || 0})}
                    placeholder="Ex: 8.50"
                  />
                </div>
                <div>
                  <Label htmlFor="timeBetweenCigarettes">Tempo entre cigarros (minutos)</Label>
                  <Input
                    id="timeBetweenCigarettes"
                    type="number"
                    value={userData.timeBetweenCigarettes || ''}
                    onChange={(e) => setUserData({...userData, timeBetweenCigarettes: parseInt(e.target.value) || 0})}
                    placeholder="Ex: 60"
                  />
                </div>
              </div>

              <Button 
                onClick={startQuitJourney}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                disabled={!userData.age || !userData.cigarettesPerDay || !userData.packPrice}
              >
                Começar Minha Jornada
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const timeSince = getTimeSinceQuit()
  const savings = calculateSavings()
  const suggestions = getSuggestions(savings.total)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pare de Fumar</h1>
                <p className="text-sm text-gray-600">
                  {timeSince.days}d {timeSince.hours}h {timeSince.minutes}m sem fumar
                </p>
              </div>
            </div>
            
            <Dialog open={emergencyMode} onOpenChange={setEmergencyMode}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Emergência
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-red-600">Modo Emergência</DialogTitle>
                  <DialogDescription>
                    Você está com vontade de fumar? Vamos superar isso juntos!
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-800 mb-2">Lembre-se do seu progresso:</h4>
                    <p className="text-emerald-700">
                      Você já economizou R$ {savings.total.toFixed(2)} e evitou {savings.cigarettesAvoided} cigarros!
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => setBreathingExercise(true)}
                    className="w-full"
                    variant="outline"
                  >
                    <Wind className="w-4 h-4 mr-2" />
                    Exercício de Respiração
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">A vontade vai passar em alguns minutos</p>
                    <p className="text-xs text-gray-500">Você é mais forte que isso!</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Exercício de Respiração Modal */}
      <Dialog open={breathingExercise} onOpenChange={setBreathingExercise}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Exercício de Respiração</DialogTitle>
            <DialogDescription>
              Siga o ritmo e respire profundamente
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <div className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${
              breathingPhase === 'inhale' ? 'border-blue-500 scale-110' : 
              breathingPhase === 'hold' ? 'border-yellow-500 scale-100' : 
              'border-green-500 scale-90'
            }`}>
              <div className="text-center">
                <div className="text-3xl font-bold">{breathingCount}</div>
                <div className="text-sm capitalize">{
                  breathingPhase === 'inhale' ? 'Inspire' :
                  breathingPhase === 'hold' ? 'Segure' : 'Expire'
                }</div>
              </div>
            </div>
            <Button 
              onClick={() => setBreathingExercise(false)}
              className="mt-6"
              variant="outline"
            >
              Finalizar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-6xl mx-auto p-4">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="progress">Progresso</TabsTrigger>
            <TabsTrigger value="achievements">Conquistas</TabsTrigger>
            <TabsTrigger value="health">Saúde</TabsTrigger>
            <TabsTrigger value="community">Comunidade</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Cards principais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    Tempo Livre
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {timeSince.days}d {timeSince.hours}h {timeSince.minutes}m
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Sem fumar</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                    Economia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    R$ {savings.total.toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Economizados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Target className="w-5 h-5 mr-2 text-purple-500" />
                    Cigarros Evitados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {savings.cigarettesAvoided}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Cigarros não fumados</p>
                </CardContent>
              </Card>
            </div>

            {/* Sugestões de compras */}
            {suggestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gift className="w-5 h-5 mr-2 text-orange-500" />
                    O que você poderia comprar
                  </CardTitle>
                  <CardDescription>
                    Com o dinheiro economizado, você já pode:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="bg-orange-50 p-4 rounded-lg">
                        <div className="font-semibold text-orange-800">{suggestion.item}</div>
                        <div className="text-sm text-orange-600">R$ {suggestion.price}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Próximo marco */}
            {(() => {
              const nextMilestone = currentMilestones.find(m => !m.achieved)
              if (!nextMilestone) return null
              
              const totalHours = timeSince.days * 24 + timeSince.hours + timeSince.minutes / 60
              const progress = (totalHours / nextMilestone.hours) * 100
              
              return (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <nextMilestone.icon className="w-5 h-5 mr-2 text-blue-500" />
                      Próximo Marco: {nextMilestone.title}
                    </CardTitle>
                    <CardDescription>{nextMilestone.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={Math.min(progress, 100)} className="mb-2" />
                    <p className="text-sm text-gray-600">
                      {Math.max(0, nextMilestone.hours - totalHours).toFixed(1)} horas restantes
                    </p>
                  </CardContent>
                </Card>
              )
            })()}
          </TabsContent>

          {/* Progresso */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Linha do Tempo de Recuperação</CardTitle>
                <CardDescription>
                  Veja como seu corpo se recupera ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentMilestones.map((milestone, index) => (
                    <div key={index} className={`flex items-start space-x-4 p-4 rounded-lg ${
                      milestone.achieved ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        milestone.achieved ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        <milestone.icon className={`w-5 h-5 ${
                          milestone.achieved ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className={`font-semibold ${
                            milestone.achieved ? 'text-green-800' : 'text-gray-700'
                          }`}>
                            {milestone.title}
                          </h4>
                          {milestone.achieved && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Conquistado!
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm ${
                          milestone.achieved ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conquistas */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Suas Conquistas</CardTitle>
                <CardDescription>
                  Desbloqueie medalhas conforme progride em sua jornada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentAchievements.map((achievement) => (
                    <div key={achievement.id} className={`p-4 rounded-lg border ${
                      achievement.unlocked ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          achievement.unlocked ? 'bg-yellow-500' : 'bg-gray-300'
                        }`}>
                          <achievement.icon className={`w-6 h-6 ${
                            achievement.unlocked ? 'text-white' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`font-semibold ${
                              achievement.unlocked ? 'text-yellow-800' : 'text-gray-700'
                            }`}>
                              {achievement.title}
                            </h4>
                            {achievement.unlocked && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                Desbloqueado!
                              </Badge>
                            )}
                          </div>
                          <p className={`text-sm mb-2 ${
                            achievement.unlocked ? 'text-yellow-700' : 'text-gray-600'
                          }`}>
                            {achievement.description}
                          </p>
                          <div className="space-y-1">
                            <Progress 
                              value={(achievement.progress / achievement.target) * 100} 
                              className="h-2"
                            />
                            <p className="text-xs text-gray-500">
                              {achievement.progress} / {achievement.target}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saúde */}
          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    Benefícios para a Saúde
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Pressão arterial normalizada</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Melhora na circulação</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Capacidade pulmonar aumentada</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Redução do risco cardíaco</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Smile className="w-5 h-5 mr-2 text-blue-500" />
                    Diário de Humor
                  </CardTitle>
                  <CardDescription>
                    Como você está se sentindo hoje?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Descreva como você está se sentindo, suas dificuldades ou conquistas do dia..."
                    value={moodEntry}
                    onChange={(e) => setMoodEntry(e.target.value)}
                    rows={4}
                  />
                  <Button 
                    onClick={() => {
                      // Salvar entrada do humor
                      const entries = JSON.parse(localStorage.getItem('moodEntries') || '[]')
                      entries.push({
                        date: new Date().toISOString(),
                        entry: moodEntry
                      })
                      localStorage.setItem('moodEntries', JSON.stringify(entries))
                      setMoodEntry('')
                    }}
                    disabled={!moodEntry.trim()}
                    className="w-full"
                  >
                    Salvar Entrada
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Mensagens de Incentivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium mb-2">
                    "Cada dia sem fumar é uma vitória. Você está mais forte do que imagina!"
                  </p>
                  <p className="text-blue-600 text-sm">
                    - Maria, ex-fumante há 2 anos
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comunidade */}
          <TabsContent value="community" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-500" />
                  Comunidade de Apoio
                </CardTitle>
                <CardDescription>
                  Conecte-se com outras pessoas na mesma jornada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">J</span>
                    </div>
                    <div>
                      <p className="font-medium text-purple-800">João Silva</p>
                      <p className="text-sm text-purple-600 mb-2">45 dias sem fumar</p>
                      <p className="text-sm text-gray-700">
                        "Hoje completei 45 dias! A vontade ainda aparece, mas cada dia fica mais fácil. 
                        Vocês conseguem também!"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">A</span>
                    </div>
                    <div>
                      <p className="font-medium text-green-800">Ana Costa</p>
                      <p className="text-sm text-green-600 mb-2">3 meses sem fumar</p>
                      <p className="text-sm text-gray-700">
                        "Dica: quando bater a vontade, faça 10 flexões. Funciona comigo!"
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Participar da Conversa
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Desafio da Semana</CardTitle>
                <CardDescription>
                  Participe do desafio coletivo desta semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    Semana do Exercício
                  </h4>
                  <p className="text-orange-700 text-sm mb-3">
                    Substitua o momento do cigarro por 5 minutos de exercício físico
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-orange-600">127 pessoas participando</span>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      Participar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}