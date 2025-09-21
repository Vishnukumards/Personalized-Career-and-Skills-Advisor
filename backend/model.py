import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

class SkillAdvisorModel:
    def __init__(self):
        self._model, self.encoders = self._train_model()

    def _train_model(self):
        # Sample data for demonstration. A real dataset would be much larger.
        data = {
            'userType': ['engineering', 'puc', 'graduate', 'engineering', 'puc', 'graduate'],
            'interest': ['building', 'analyzing', 'managing', 'building', 'designing', 'analyzing'],
            'skill_interest': ['technical', 'data', 'leadership', 'technical', 'creative', 'data'],
            'career_path': ['Software Engineer', 'Data Scientist', 'Product Manager', 'Software Engineer', 'UX/UI Designer', 'Data Scientist']
        }
        df = pd.DataFrame(data)

        # Preprocessing: Convert categorical data to numbers
        encoders = {col: LabelEncoder().fit(df[col]) for col in df.columns}
        df_encoded = df.apply(lambda x: encoders[x.name].transform(x))

        X = df_encoded.drop('career_path', axis=1)
        y = df_encoded['career_path']
        
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X, y)
        
        return model, encoders

    def predict(self, user_data):
        df = pd.DataFrame([user_data])
        
        # Use the stored encoders to transform the input
        df_encoded = df.apply(lambda x: self.encoders[x.name].transform(x))

        prediction_encoded = self._model.predict(df_encoded)
        
        # Decode the prediction back to a readable string
        career_path = self.encoders['career_path'].inverse_transform(prediction_encoded)
        return career_path[0]

# Create a single instance of the model to be used by the app
model = SkillAdvisorModel()